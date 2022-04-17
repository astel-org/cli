import prettier from 'prettier'
import type { BuiltInParserName } from 'prettier'

export const formatComponentName = (componentName: string) => {
  return componentName.split('-').length > 1
    ? componentName
        .split('-')
        .map((name: string) => name.slice(0, 1).toUpperCase() + name.slice(1))
        .join('')
    : componentName.slice(0, 1).toUpperCase() + componentName.slice(1)
}

export const formatCode = (parser: BuiltInParserName, code: string) =>
  prettier.format(code, {
    parser,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 2,
  })
