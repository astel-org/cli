import path, { join } from 'path'
import klawSync from 'klaw-sync'

export interface ComponentEntries {
  path: string
  name: string
  formattedName: string
  prefixedName: string
}

export const getComponentEntries = (entry: string, ignoreDirs: string[]) => {
  const componentEntries: string[] = []

  const entryDir = path.dirname(entry)

  klawSync(entryDir, {
    nofile: true,
    depthLimit: 0,
    filter: (item) => {
      const basename = path.basename(item.path)
      return !ignoreDirs.includes(basename)
    },
  }).forEach((dir) => {
    const entry = join(dir.path, 'index.ts')
    componentEntries.push(entry)
  })

  return componentEntries
}
