import path from 'path'
import { formatComponentName } from '../utils/format'
import { getComponentEntries } from './generate-entry'

export interface ComponentNames {
  name: string
  formattedName: string
  prefixedName: string
}

export const getComponentNames = (entry: string, ignoreDirs: string[], prefix: string) => {
  const componentNames: ComponentNames[] = []

  const components = getComponentEntries(entry, ignoreDirs)

  components.forEach((name) => {
    const delimiter = path.basename(name)
    const sanitizedName = path.basename(name.split(delimiter)[0])

    componentNames.push({
      name: sanitizedName,
      formattedName: formatComponentName(sanitizedName),
      prefixedName: formatComponentName(`${prefix}-${sanitizedName}`),
    })
  })

  return componentNames
}
