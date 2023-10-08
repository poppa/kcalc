const objProto = Reflect.getPrototypeOf({})
const nullProto = Reflect.getPrototypeOf(Object.create(null))

type AnyArray = unknown[]
type AnyObject = Record<string | number | symbol, unknown>
type AnyMap = Map<unknown, unknown>
type AnySet = Set<unknown>

function isClonableDomElement(obj: unknown): obj is Element {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nodeType' in obj &&
    'cloneNode' in obj &&
    typeof obj.cloneNode === 'function'
  )
}

function isObjectLiteral(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const proto = Reflect.getPrototypeOf(obj)
  return proto === objProto || proto === nullProto
}

function isPrimitive(val: unknown): boolean {
  return (
    Object(val) !== val ||
    val instanceof String ||
    val instanceof Number ||
    val instanceof Boolean
  )
}

function lowCopy<T>(input: T, cyclic: WeakMap<object, unknown>): T {
  if (!input || isPrimitive(input)) {
    return input
  }

  if (cyclic.has(input)) {
    return cyclic.get(input) as T
  }

  if (Array.isArray(input)) {
    const ar: unknown[] = []
    cyclic.set(input, ar)

    for (const item of input) {
      ar.push(lowCopy(item, cyclic))
    }
    return ar as T
  }

  // prettier-ignore
  const result: object
    // It's easy to clone a date
    = input instanceof Date ? new Date(input)
    // It's easy to clone a RegExp
    : input instanceof RegExp ? new RegExp(input.source, input.flags)
    // Shallow copy Set:s ...
    : input instanceof Set ? new Set(input)
    // ... as well as Map keys
    : input instanceof Map ? new Map(
      Array.from(input, ([k, v]) => [k, lowCopy(v, cyclic)]))
    // DOM nodes has the cloneNode() method
    : isClonableDomElement(input) ? input.cloneNode(true)
    // Class instances and such we copy by reference
    : !isObjectLiteral(input) ? input
    // Empty object whitout prototype to copy the input into
    : Object.create(null)

  cyclic.set(input, result)

  return Object.assign(
    result,
    ...Object.entries(input).map(([k, v]) => {
      return { [k]: lowCopy(v, cyclic) }
    })
  )
}

/**
 * Make a deep copy of `input`
 *
 * @note
 *  - This function will not try to copy class instances, since such objects
 *    might contain hidden state that wouldn't end up in the copy.
 *  - Keys in maps and sets will not be cloned if they are objects. The copy
 *    will have the same keys as the original.
 *  - WeakMap:s and WeakSet:s will not be cloned
 * @param input
 */
export function deepCopy<
  T extends AnyArray | readonly unknown[] | AnyObject | AnySet | AnyMap,
>(input: T): T {
  return lowCopy(input, new WeakMap())
}
