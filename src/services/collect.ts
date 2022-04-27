import { writeFileSync } from 'fs-extra'
import { formatCode } from '../utils/format'
import { Logger } from '../utils/logger'
import { getComponentNames } from '../helpers/generate-name'
import { getInstallTemplate } from '../templates/install.template'
import type { AstelConfig } from '../config'

export class Collect {
  private config: AstelConfig

  constructor(config: AstelConfig) {
    this.config = config
  }

  collectComponents() {
    try {
      Logger.info('Collecting component entries', 'cli')
      const componentEntries = getComponentNames(
        this.config.build.entry,
        this.config.ignoreDirs,
        this.config.build.prefix
      )

      const templateCode = getInstallTemplate(componentEntries)

      const formattedCode = formatCode('typescript', templateCode)

      writeFileSync(this.config.build.entry, formattedCode)

      Logger.success('Collected succesfully', 'cli')
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message)
        process.exit(1)
      }
    }
  }
}
