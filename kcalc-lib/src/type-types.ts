export type Maybe<T> = T | undefined
export type Nullable<T> = T | null
export type NullableOrUndefined<T> = T | null | undefined
export type MaybeFalsy<T> = T | null | undefined | 0 | false
export type AnyFunction = (...args: any[]) => any
export type VoidFunction = () => void
export type PlainObject<T = any> = { [key: string | symbol | number]: T }
export type Class<T> = new (...args: any[]) => T
export type Callable = () => any

export type DecoratorFn = <T>(
  _target: T,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) => void

// prettier-ignore
export type TypeOf<T> =
  T extends string ? string :
  T extends number ? number :
  T extends boolean ? boolean :
  T

export type DeepPartial<T> = T extends AnyFunction
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T
