import { extname } from 'path'
import { cwd } from 'process'
import { defu } from 'defu'
import { loadConfig } from 'unconfig'
import { Logger } from './utils/logger'

export type Formats = 'esm' | 'umd'

export interface LibraryOptions {
  outputDir: string
  format: Formats
  summary: boolean
}

export interface BundleOptions {
  outputDir: string
  format: Formats
  name: string
  summary: boolean
}

export interface Build {
  entry: string
  emptyOutDir?: boolean
  library?: LibraryOptions[]
  bundle?: BundleOptions[]
}

export interface AstelConfig {
  build: Build
  prefix: string
  ignoreDirs: string[]
  declarationDir: string
}

const defaultConfig: Partial<AstelConfig> = {
  ignoreDirs: ['.DS_Store'],
  prefix: 'as',
  declarationDir: 'dist/types',
  build: {
    entry: cwd(),
    emptyOutDir: false,
    library: [],
    bundle: [],
  },
}

export const defineAstelConfig = (config: Partial<AstelConfig>): Partial<AstelConfig> => {
  return config
}

export const resolveConfig = async () => {
  try {
    const { config } = await loadConfig<AstelConfig>({
      sources: [
        {
          files: 'astel.config',
          extensions: ['ts', 'js', 'mjs', 'cjs', 'json'],
        },
      ],
    })

    // validations
    if (!config)
      throw new Error(
        'Config not found. Make sure to place astel.config.ts/js at the root of the project'
      )

    if (!config?.build?.entry || !extname(config?.build?.entry))
      throw new Error('Entry path should end in .ts or .js')

    const mergedConfig = defu(config, defaultConfig)

    return mergedConfig
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(error.message)
      process.exit(1)
    }
  }
}
