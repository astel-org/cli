import { blue, bold, green } from 'colorette'
import consola from 'consola'

export class Logger {
  public static error = (str: string | unknown) => consola.error(str)

  public static warn = (str: string | unknown) => consola.warn(str)

  public static success = (str: string | unknown, category = 'cli') =>
    consola.success(bold(green(category.toUpperCase())), str)

  public static info = (str: string | unknown, category = 'cli') =>
    consola.info(bold(blue(category.toUpperCase())), str)
}
