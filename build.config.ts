import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      format: 'cjs',
      ext: 'js',
      input: 'src/',
    },
    {
      format: 'esm',
      ext: 'mjs',
      input: 'src/',
    },
  ],
  outDir: 'dist',
  declaration: true,
  clean: true,
})
