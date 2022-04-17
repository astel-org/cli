import zlib from 'node:zlib'
import cleanCss from 'clean-css'
import { readFileSync, statSync } from 'fs-extra'
import { transform } from 'esbuild'

export const getFileSize = async (filePath: string) => {
  let minifiedContent, minifiedSize

  const fileContent = readFileSync(filePath, 'utf8')

  if (filePath.includes('.css')) {
    minifiedContent = new cleanCss().minify(fileContent)
    minifiedSize = minifiedContent.stats.minifiedSize
  } else {
    minifiedContent = await transform(fileContent, { minify: true, charset: 'utf8' })
    minifiedSize = minifiedContent.code.length
  }

  // sanitize sizes
  const size = statSync(filePath).size
  const gzippedSize = zlib.gzipSync(fileContent, { level: 9 }).length
  const brotliSize = zlib.brotliCompressSync(fileContent).length
  return {
    size,
    gzippedSize,
    minifiedSize,
    brotliSize,
  }
}
