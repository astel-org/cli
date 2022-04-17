# Astel Cli

CLI tool for astel

## Installation

```sh
yarn add @astel/cli
```

Or

```sh
npm install @astel/cli
```

## Configuration

Astel cli uses a config file `astel.config.ts/js` to detect basic configuration for all commands.

Sample config :

```js
import { defineAstelConfig } from '@astel/cli'

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
```

## Commands

### generate

Generate a new component.

Usage :  `npx astel generate <component-name>`

### collect

Collect all component entries and generate `index.ts` entry point for building

### build

Builds the bundle/library according to the configuration in `config.build`

### types

Generate type definitions

## License

[MIT](./LICENSE) License © 2021 [Sumit Kolhe](https://github.com/sumitkolhe)
