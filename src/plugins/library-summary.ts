import { getFileSize } from '../helpers/file-size'
import { Logger } from '../utils/logger'
import { printSummaryTable } from '../helpers/summary-table'
import type { SummaryDetails } from '../helpers/summary-table'
import type { BuildResult, Plugin } from 'esbuild'

// build summary for esbuild
export const librarySummary = (): Plugin => {
  return {
    name: 'library-build-summary',
    async setup({ initialOptions, onEnd }) {
      try {
        const { outdir } = initialOptions
        if (!outdir) return

        onEnd(async (result: BuildResult) => {
          const summary: SummaryDetails[] = []

          const outputFiles = result.metafile!.outputs

          for (const filePath of Object.keys(outputFiles)) {
            const sizes = await getFileSize(filePath)

            summary.push({
              fileName: filePath,
              ...sizes,
            })
          }
          printSummaryTable(summary)
        })
      } catch (error) {
        if (error instanceof Error) Logger.error(error.message)
      }
    },
  }
}
