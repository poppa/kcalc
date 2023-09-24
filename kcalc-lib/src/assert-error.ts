import type { Class, Maybe } from "./type-types.js"

/**
 * Assert that `e` is an error of type `T`.
 *
 * @param error - The error to assert to be of type `T`
 * @param errorClass - The class to test that `e` is an instance of. Defaults
 *  to `Error`
 * @throws An `Error` is thrown if `e` is not an instance of `T`
 * @seealso {@link assumeError()}
 */
export function assertError<T extends Error = Error>(
  error: unknown,
  errorClass?: Maybe<Class<T>>
): asserts error is T {
  const checkClass = errorClass ?? Error

  if (!(error instanceof checkClass)) {
    throw new Error(
      `Argument \`error\` of type ${typeof error} is not an Error`
    )
  }
}

/**
 * Assumes that `e` is an instance of `T`.
 *
 * This is just a type-guard and no runtime check is made to assert that
 * `e` actually is an instance of `T`.
 *
 * @param e - The error to assert to be of type `T`
 * @param errorClass - The class to test that `e` is an instance of. Defaults
 *  to `Error`
 * @seealso {@link assertError()}
 */
export function assumeError<T extends Error = Error>(
  e: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  errorClass?: Maybe<Class<T>>
): asserts e is T {
  // this does nothing
}
