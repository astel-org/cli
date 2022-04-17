import { extname } from 'path'
import { cwd } from 'process'
import { defu } from 'defu'
import { loadConfig } from 'unconfig'
import { Logger } from './utils/logger'

export type Formats = 'esm' | 'umd'

export interface Library {
  outputDir: string
  format: Formats
  name: string
  bundle: boolean
  summary: boolean
}

export interface Build {
  entry: string
  prefix: string
  declaration: boolean | string
  library: Library[]
  emptyOutDir: boolean
}

export interface AstelConfig {
  build: Build
  ignoreDirs: string[]
}

const defaultConfig: Partial<AstelConfig> = {
  ignoreDirs: ['.DS_Store'],
  build: {
    entry: cwd(),
    prefix: 'as',
    emptyOutDir: false,
    declaration: false,
    library: [],
  },
}

export const defineAstelConfig = (config: AstelConfig): AstelConfig => {
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

    if (!config.build.entry || !extname(config.build.entry))
      throw new Error('Entry path should end in .ts or .js')

    const mergedConfig = defu(config, defaultConfig)

    return mergedConfig
  } catch (error) {
    if (error instanceof Error) {
      Logger.error(error.stack)
      process.exit(1)
    }
  }
}
