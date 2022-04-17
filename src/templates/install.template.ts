import type { ComponentNames } from '../helpers/generate-name'

export const getInstallTemplate = (components: ComponentNames[]) => {
  return `
      ${components
        .map((component) => `import {${component.formattedName}} from './${component.name}';`)
        .join('\n')}
      import type {App} from 'vue';
    
      const components = [${components.map((component) => component.formattedName)}];\n
  
      const install = (app: App) => {
        components.forEach((component) => {
          component.name &&
            app.component(component.name, component)
        })
      }\n
  
      export default { install };

      ${components
        .map(
          (component) =>
            `export {default as ${component.formattedName}} from './${component.name}';`
        )
        .join('\n')}
      `
}
