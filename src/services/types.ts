import { dirname, join, resolve } from 'path'
import { cwd } from 'process'
import { exec } from 'shelljs'
import { ensureFileSync, readFile, readJSONSync, removeSync, writeFileSync } from 'fs-extra'
import { Logger } from '../utils/logger'
import { getComponentNames } from '../helpers/generate-name'
import { autoImportTemplate } from '../templates/auto-import-template'
import { formatCode } from '../utils/format'
import type { AstelConfig } from '../config'

export class Types {
  private config: AstelConfig

  constructor(config: AstelConfig) {
    this.config = config
  }

  public generateTypes = async () => {
    try {
      if (!this.config.build.entry) return

      let outDir: string

      if (this.config.build.declaration === true) outDir = 'dist/types'
      else outDir = this.config.build.declaration as string

      // create types
      await this.buildDts(this.config.build.entry, outDir)

      // create auto imports
      await this.createAutoImport(outDir)
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(error.message)
        process.exit(1)
      }
    }
  }

  private buildDts = async (entry: string, outDir: string) => {
    try {
      Logger.info('Building types', 'DTS')
      const declarationContent = await readFile(resolve(__dirname, '..', 'dts.json'))

      const resolvedPath = join(dirname(entry), 'dts.json')

      writeFileSync(resolvedPath, declarationContent)

      exec(`vue-tsc -p ${resolvedPath} --declarationDir ${outDir}`)

      removeSync(resolvedPath)

      Logger.success('Types built successully', 'DTS')
    } catch (error) {
      if (error instanceof Error) Logger.error(error.stack)
    }
  }

  private createAutoImport = async (outDir: string) => {
    try {
      Logger.info('Building Auto Imports', 'DTS')

      const pkg = readJSONSync(resolve(cwd(), 'package.json'))

      const componentsEntries = getComponentNames(
        this.config.build.entry,
        this.config.ignoreDirs!,
        this.config.build.prefix
      )

      const autoimport = autoImportTemplate(pkg.name || '@astel', componentsEntries)

      const dtsPath = resolve(dirname(outDir), 'components.d.ts')

      ensureFileSync(dtsPath)

      writeFileSync(dtsPath, formatCode('typescript', autoimport))

      Logger.success('Auto imports built successfully', 'DTS')
    } catch (error) {
      if (error instanceof Error) Logger.error(error.message)
    }
  }
}
