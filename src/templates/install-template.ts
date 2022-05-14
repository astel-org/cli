import type { ComponentNames } from '../helpers/generate-name'

export const getInstallTemplate = (components: ComponentNames[]) => {
  const componentList: string[] = []
  let template = `import type {App} from 'vue';\n`
  let utilsExport = ``
  let exportedComponents = ``

  components.forEach((component) => {
    if (component.name === 'utils') {
      utilsExport += `export * from './utils';\n`
      return
    }

    componentList.push(component.formattedName)

    template += `import {${component.formattedName}} from './${component.name}';\n`
    exportedComponents += `export {default as ${component.formattedName}} from './${component.name}';\n`
  })

  template += `\nconst components = [${componentList}];\n\n 
  
  const install = (app: App) => {
    components.forEach((component) => {
      component.name &&
        app.component(component.name, component)
    })
  }\n
  `
  template += `
  ${exportedComponents};\n
  ${utilsExport}
  export default { install };\n`

  return template
}
