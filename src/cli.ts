import { Command } from 'commander'
import { resolveConfig } from './config'
import { Builder } from './services/build'
import { Collect } from './services/collect'
import { Component } from './services/component'
import { Types } from './services/types'

export const cli = new Command()

cli
  .command('collect')
  .description('Collect components and create entry file')
  .action(async () => {
    const config = await resolveConfig()
    const collector = new Collect(config!)
    collector.collectComponents()
  })

cli
  .command('generate')
  .argument('<componentName>')
  .description('Generate a new component')
  .action(async (componentName: string) => {
    const config = await resolveConfig()
    const generator = new Component(config!, componentName)
    generator.generateComponent()
  })

cli
  .command('build')
  .description('Build Astel UI for distribution')
  .action(async () => {
    const config = await resolveConfig()
    const builder = new Builder(config!)
    await builder.buildPackages()
  })

cli
  .command('types')
  .description('Generate types')
  .action(async () => {
    const config = await resolveConfig()
    const types = new Types(config!)
    await types.generateTypes()
  })

cli.parse()
