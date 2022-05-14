export const getIndexTemplate = (componentName: string, formattedComponentName: string) => {
  return `
    import { withInstall } from '../utils'
    import _${formattedComponentName} from './${componentName}.vue'

    export const ${formattedComponentName} = withInstall(_${formattedComponentName})

    export default ${formattedComponentName}
  `
}
