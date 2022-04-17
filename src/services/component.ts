import { mkdirSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { formatCode, formatComponentName } from '../utils/format'
import { checkIfComponentExists, checkIfComponentNameIsValid } from '../utils/validator'
import { Logger } from '../utils/logger'
import { indexTemplate } from '../templates/index.template'
import { styleTemplate } from '../templates/style.template'
import { vueTemplate } from '../templates/vue.template'
import type { AstelConfig } from '../config'

export class Component {
  private config: AstelConfig
  private componentName: string
  private formattedComponentName: string
  private componentDir: string

  constructor(config: AstelConfig, componentName: string) {
    this.config = config
    this.componentName = componentName
    this.formattedComponentName = formatComponentName(componentName)
    this.componentDir = resolve(dirname(this.config.build.entry), this.componentName)
  }

  // generate a new component with given name
  public generateComponent = () => {
    try {
      if (!this.componentName) {
        Logger.error('Component name missing')
        return
      }

      Logger.info(`Generating component: ${this.componentName}`, 'cli')

      checkIfComponentNameIsValid(this.componentName)
      checkIfComponentExists(this.componentDir)

      // create component directory
      mkdirSync(this.componentDir)

      // create vue SFC
      const vue = vueTemplate(this.config.build.prefix, this.componentName)
      writeFileSync(resolve(this.componentDir, `${this.componentName}.vue`), formatCode('vue', vue))

      // create style
      const style = styleTemplate(this.config.build.prefix, this.componentName)
      writeFileSync(resolve(this.componentDir, 'style.less'), formatCode('less', style))

      // create install
      const installTemplate = indexTemplate(this.componentName, this.formattedComponentName)
      writeFileSync(
        resolve(this.componentDir, 'index.ts'),
        formatCode('typescript', installTemplate)
      )

      Logger.success('Component generated successfully', 'cli')
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message)
        process.exit(1)
      }
    }
  }
}
