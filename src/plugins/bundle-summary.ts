import { join } from 'path'
import { getFileSize } from '../helpers/file-size'
import { Logger } from '../utils/logger'
import { printSummaryTable } from '../helpers/summary-table'
import type { OutputBundle } from 'rollup'
import type { SummaryDetails } from '../helpers/summary-table'
import type { PluginOption } from 'vite'

// build summary for rollup
export const bundleSummary = (): PluginOption => {
  let outDir: string

  return {
    enforce: 'post',
    name: 'bundle-build-summary',
    apply: 'build',

    // get the output dir
    configResolved(resolvedConfig) {
      outDir = resolvedConfig.build.outDir
    },

    async writeBundle(_outputOptions, bundle: OutputBundle) {
      try {
        const summary: SummaryDetails[] = []

        for (const key of Object.keys(bundle)) {
          if (!bundle[key]) continue

          const filePath = join(outDir, key)
          const sizes = await getFileSize(filePath)

          summary.push({
            fileName: filePath,
            ...sizes,
          })
        }
        printSummaryTable(summary)
      } catch (error) {
        if (error instanceof Error) Logger.error(error.message)
      }
    },
  }
}
