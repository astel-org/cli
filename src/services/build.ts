import { join } from 'path'
import { emptyDirSync, readFileSync, writeFileSync } from 'fs-extra'
import { build as esBuilder, transformSync } from 'esbuild'
import vueEsbuildPlugin from 'esbuild-plugin-vue'
import { build as viteBuilder } from 'vite'
import vue from '@vitejs/plugin-vue'
import { redBright } from 'colorette'
import { bundleSummary } from '../plugins/bundle-summary'
import { Logger } from '../utils/logger'
import { getComponentEntries } from '../helpers/generate-entry'
import { librarySummary } from '../plugins/library-summary'
import { injectStyles } from '../plugins/inject-style'
import type { UserConfig } from 'vite'
import type { BuildOptions } from 'esbuild'
import type { AstelConfig, BundleOptions, LibraryOptions } from '../config'

export class Builder {
  private config: AstelConfig

  constructor(config: AstelConfig) {
    this.config = config
  }

  public buildPackages = async () => {
    try {
      if (this.config.build.bundle!.length === 0 && this.config.build.library!.length === 0)
        return Logger.info('No build config found', 'cli')

      Logger.info('Build Started...', 'cli')

      if (this.config.build.library!.length > 0) {
        for (const build of this.config.build.library!) {
          if (this.config.build.emptyOutDir) {
            Logger.info(`Clearing output directory [${redBright(build.outputDir)}]`, 'cli')
            emptyDirSync(build.outputDir)
          }

          // create library
          const componentEntries = getComponentEntries(
            this.config.build.entry,
            this.config.ignoreDirs
          )
          const mainEntry = this.config.build.entry
          await this.buildLibrary(componentEntries, mainEntry, build)
        }
      }

      if (this.config.build.bundle!.length > 0) {
        for (const build of this.config.build.bundle!) {
          if (this.config.build.emptyOutDir) {
            Logger.info(`Clearing output directory [${redBright(build.outputDir)}]`, 'cli')
            emptyDirSync(build.outputDir)
          }

          // create bundle
          await this.buildBundle(this.config.build.entry, build)
        }
      }

      Logger.success('Build successful', 'cli')
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error.message)
        process.exit(1)
      }
    }
  }

  private buildLibrary = async (
    componentEntries: string[],
    mainEntry: string,
    buildConfig: LibraryOptions
  ) => {
    Logger.info(`Creating library...`, buildConfig.format)

    const plugins = [vueEsbuildPlugin(), injectStyles()]

    // esbuild doesn't accept empty plugins, need to conditionally push plugins
    if (buildConfig.summary) plugins.push(librarySummary())

    const format = buildConfig.format === 'umd' ? 'cjs' : buildConfig.format

    const esBuildConfig: BuildOptions = {
      outdir: buildConfig.outputDir,
      bundle: true,
      entryPoints: componentEntries,
      plugins,
      external: ['vue'],
      format,
      minifyWhitespace: true,
      metafile: true,
    }

    // write bundle
    await esBuilder(esBuildConfig)

    // transform index file since its not processed when iterating over folders
    const indexContent = readFileSync(mainEntry, 'utf-8')
    const indexOutput = transformSync(indexContent, { loader: 'ts', format })

    const outFile = join(buildConfig.outputDir, 'index.js')
    writeFileSync(outFile, indexOutput.code)

    Logger.success('Library created', buildConfig.format)
  }

  private buildBundle = async (entry: string, buildConfig: BundleOptions) => {
    Logger.info(`Creating bundle...`, buildConfig.format)

    const viteConfig: UserConfig = {
      logLevel: 'silent',
      plugins: [
        vue({
          style: { preprocessLang: 'less' },
        }),
        buildConfig.summary ? bundleSummary() : null,
      ],
      build: {
        outDir: buildConfig.outputDir,
        emptyOutDir: false,
        lib: {
          entry,
          name: buildConfig.name,
          formats: [buildConfig.format === 'esm' ? 'es' : buildConfig.format],
          fileName: buildConfig.name,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            assetFileNames: '[name].[ext]',
            exports: 'named',
            globals: { vue: 'Vue' },
          },
        },
      },
    }
    await viteBuilder(viteConfig)
    Logger.success('Bundle created', buildConfig.format)
  }
}
