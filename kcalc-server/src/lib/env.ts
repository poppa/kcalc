import { browser } from '$app/environment'
import { env } from '$env/dynamic/private'
import { env as publenv } from '$env/dynamic/public'
import {
  isBoolean,
  isFloat,
  isNumber,
  isUndefined,
  type AnyFunction,
  type DecoratorFn,
  type Maybe,
  type TypeOf,
  isClass,
  type Class,
} from '@poppanator/kcalc-lib'

export type Type = 'string' | 'int' | 'float' | 'boolean' | 'json' | 'array'

type AnyObj = Record<string, unknown>
type EnvFn = (name: string | string[]) => DecoratorFn

export interface Env {
  (name: string | string[], type: Type): AnyFunction

  string: EnvFn
  int: EnvFn
  float: EnvFn
  boolean: EnvFn
  json: EnvFn
  array: EnvFn
  String: 'string'
  Int: 'int'
  Float: 'float'
  Boolean: 'boolean'
  Json: 'json'
  Array: 'array'
}

/**
 * Method accessor decorator that will return the value of `process.env[name]`
 * if that exists, and will be casted to `type`
 * @param name - Environment variable name to return. If `name` is an array
 *  the first found environment variable will be used
 * @param type - Type to cast the environment variable to
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export function Env(name: string | string[], type: Type = 'string') {
  return function <T>(
    _target: T,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    if (!Array.isArray(name)) {
      name = [name]
    }

    const resolveEnv = (key: string): boolean => {
      const value: string | undefined =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (browser ? publenv[key] : env[key])?.toString()

      if (descriptor.get && value !== undefined) {
        switch (type) {
          case 'boolean': {
            descriptor.get = (): boolean =>
              ['true', '1', 'yes', 'y'].includes(value.toLowerCase())
            break
          }

          case 'int': {
            descriptor.get = (): number => parseInt(value, 10)
            break
          }

          case 'float': {
            descriptor.get = (): number => parseFloat(value)
            break
          }

          case 'json': {
            descriptor.get = (): AnyObj => JSON.parse(value) as AnyObj
            break
          }

          case 'array': {
            descriptor.get = (): string[] => {
              let ret: string[] = []

              if (value.includes(',')) {
                ret = value.split(',').map((s) => s.trim())
              } else {
                ret = [value]
              }

              return ret
            }

            break
          }

          default: {
            descriptor.get = (): string => value
          }
        }

        return true
      }

      return false
    }

    for (const n of name) {
      if (resolveEnv(n)) {
        break
      }
    }
  }
}

Env.string = (name: string | string[]): DecoratorFn => Env(name, 'string')
Env.int = (name: string | string[]): DecoratorFn => Env(name, 'int')
Env.float = (name: string | string[]): DecoratorFn => Env(name, 'float')
Env.boolean = (name: string | string[]): DecoratorFn => Env(name, 'boolean')
Env.json = (name: string | string[]): DecoratorFn => Env(name, 'json')
Env.array = (name: string | string[]): DecoratorFn => Env(name, 'array')

Env.String = 'string'
Env.Int = 'int'
Env.Float = 'float'
Env.Boolean = 'boolean'
Env.Json = 'json'
Env.Array = 'array'

type EnvValue = string | number | boolean

export function getenv<T extends EnvValue = string>(name: string): Maybe<T>
export function getenv<T extends EnvValue | Class<Error> = string>(
  name: string,
  defaultValue: T
): T extends Class<Error> ? string : TypeOf<T>
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getenv(name: string, defaultValue?: unknown) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const val = (browser ? publenv[name] : env[name])?.toString()

  if (isUndefined(val)) {
    if (!isUndefined(defaultValue)) {
      if (isClass(defaultValue) && defaultValue.prototype instanceof Error) {
        throw new defaultValue(name)
      }

      return defaultValue
    }

    return undefined
  }

  if (isBoolean(defaultValue)) {
    return ['true', '1', 'yes', 'y'].includes(val === '' ? 'y' : val.trim())
  }

  if (isFloat(defaultValue)) {
    return parseFloat(val)
  }

  if (isNumber(defaultValue)) {
    return parseInt(val, 10)
  }

  return val
}

export class EnvMissingError extends Error {
  constructor(envName: string) {
    super(`The required environment variable "${envName}" is not set`)
  }
}
