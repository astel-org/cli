import path from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs-extra'
import { Logger } from '../utils/logger'
import type { BuildResult, Plugin } from 'esbuild'

export const injectStyles = (): Plugin => {
  return {
    name: 'inject-styles',
    async setup({ initialOptions, onEnd }) {
      try {
        const { outdir } = initialOptions
        if (!outdir) return

        onEnd(async (result: BuildResult) => {
          const outputFiles = result.metafile!.outputs

          for (const filePath of Object.keys(outputFiles)) {
            if (!filePath.includes('.js')) continue

            const dirName = path.dirname(filePath)

            if (existsSync(`${dirName}/index.css`)) {
              const data = readFileSync(filePath).toString().split('\n')
              data.splice(0, 0, `import './index.css'`)
              const text = data.join('\n')

              writeFileSync(filePath, text)
            }
          }
        })
      } catch (error) {
        if (error instanceof Error) Logger.error(error.message)
      }
    },
  }
}
