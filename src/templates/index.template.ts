export const indexTemplate = (componentName: string, formattedComponentName: string) => {
  return `
    import _${formattedComponentName} from './${componentName}.vue'
    import { withInstall } from '../utils/with-install'

    export const ${formattedComponentName} = withInstall(_${formattedComponentName})

    export default ${formattedComponentName}
  `
}
