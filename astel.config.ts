import { defineAstelConfig } from './src/config'

export default defineAstelConfig({
  ignoreDirs: ['.DS_Store'],
  prefix: 'as',
  declarationDir: 'dist/types',
  build: {
    entry: 'library/index.ts',
    library: [
      {
        format: 'esm',
        outputDir: 'dist/es',
        summary: true,
        minify: ['identifiers', 'syntax', 'whitespace'],
      },
      {
        format: 'umd',
        outputDir: 'dist/lib',
        summary: false,
        minify: ['syntax', 'identifiers', 'whitespace'],
      },
    ],
    bundle: [{ name: 'avid', format: 'esm', outputDir: 'dist/es', summary: true }],
  },
})
