import type { AnyFunction, Callable, Class } from './type-types.js'

const objProto = Reflect.getPrototypeOf({})

export function isPrimitive(t: unknown): t is number | boolean | string {
  const to = typeof t

  return (
    to !== 'undefined' &&
    (to === 'boolean' || to === 'string' || to === 'number')
  )
}

export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

export function isNull(v: unknown): v is null {
  return v === null
}

export function isNullOrUndefined(v: unknown): v is null | undefined {
  return isUndefined(v) || isNull(v)
}

export const isDefined = <T>(v: T | undefined): v is T => !isNullOrUndefined(v)

export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean'
}

export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export function isNumber(v: unknown): v is number {
  return typeof v === 'number'
}

export function isPlainObject(
  v: unknown
): v is Record<string | number | symbol, unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    Reflect.getPrototypeOf(v) === objProto
  )
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isInstance(v: unknown): v is object {
  return (
    !Array.isArray(v) &&
    typeof v === 'object' &&
    v !== null &&
    Reflect.getPrototypeOf(v) !== objProto
  )
}

export function isFloat(v: unknown): v is number {
  return isNumber(v) && `${v}`.includes('.')
}

export function isBigInt(v: unknown): v is bigint {
  return typeof v === 'bigint'
}

export function isCallable(v: unknown): v is Callable {
  return typeof v !== 'undefined' && typeof v === 'function'
}

export function isClass(v: unknown): v is Class<unknown> {
  return (
    typeof v === 'function' && v !== null && typeof v.constructor === 'function'
  )
}

/**
 * Check if `f` is a function
 */
export function isFunction(f: unknown): f is AnyFunction {
  return f !== null && typeof f === 'function' && f.prototype === undefined
}

export function isObject<T>(
  what: Record<string, unknown> | T
): what is Record<string, unknown> {
  return (
    typeof what === 'object' &&
    what !== null &&
    !Array.isArray(what) &&
    !isFunction(what)
  )
}

/**
 * Checks if `obj` has both a `then` and a `catch` method
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise<T, S = any>(obj: Promise<S> | T): obj is Promise<S> {
  return (
    isObject(obj) &&
    typeof obj.then === 'function' &&
    typeof obj.catch === 'function'
  )
}

export function required<T>(t: T): Required<T> {
  return t as Required<T>
}
