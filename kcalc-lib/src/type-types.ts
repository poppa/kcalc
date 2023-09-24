export type Maybe<T> = T | undefined
export type Nullable<T> = T | null
export type NullableOrUndefined<T> = T | null | undefined
export type MaybeFalsy<T> = T | null | undefined | 0 | false
export type AnyFunction = (...args: any[]) => any
export type VoidFunction = () => void
export type PlainObject<T = any> = { [key: string | symbol | number]: T }
export type Class<T = any> = new (...args: any[]) => T
