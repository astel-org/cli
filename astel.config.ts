import { defineAstelConfig } from './src/config'

export default defineAstelConfig({
  ignoreDirs: ['.DS_Store', 'utils'],
  build: {
    entry: 'library/index.ts',
    prefix: 'as',
    emptyOutDir: true,
    declaration: true,
    library: [
      { name: 'astel', format: 'esm', outputDir: 'dist/es', bundle: true, summary: true },
      { name: 'astel', format: 'umd', outputDir: 'dist/lib', bundle: true, summary: true },
    ],
  },
})
