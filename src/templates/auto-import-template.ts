import type { ComponentNames } from '../helpers/generate-name'

export const autoImportTemplate = (packageName: string, components: ComponentNames[]) => {
  return `
      declare module '@vue/runtime-core' {
        export interface GlobalComponents {

        ${components
          .map(
            (component) =>
              `${component.prefixedName}: typeof import ('${packageName}')['${component.formattedName}']`
          )
          .join('\n')}
        }
    }

    export {}
    `
}
