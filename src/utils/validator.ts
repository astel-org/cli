import { existsSync } from 'fs'

export const checkIfComponentNameIsValid = (text: string) => {
  if (!/^[a-z]+(-[a-z]+)*$/.test(text)) throw new Error(`Invalid name: ${text}\n`)
}

export const checkIfComponentExists = (componentDir: string) => {
  if (existsSync(componentDir)) throw new Error('Component already exists!')
}
