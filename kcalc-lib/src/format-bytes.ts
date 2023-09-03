type Unit = 'si' | 'iec'
type UnitEntry = {
  singleByte: string
  units: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
}
type UnitsMap = Record<Unit, UnitEntry>
type Options = {
  /**
   * Unit
   * @default 'si'
   */
  unit?: Unit
  /**
   * Number of decimals
   * @default 2
   */
  precision?: number
}

const Units: UnitsMap = {
  si: {
    singleByte: 'Byte',
    units: ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  },
  iec: {
    singleByte: 'byte',
    units: ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
  },
}

/**
 * Format `bytes` into a human readable string, in either SI (default) or
 * IEC standard.
 *
 * @param bytes
 * @param options
 */
export function formatBytes(
  bytes: number,
  { unit, precision }: Options = {}
): string {
  if (precision && precision < 1) {
    throw new Error(`The precision option can not be negative`)
  }

  unit = unit ?? 'si'
  const units = Units[unit]
  // Order of magnitude
  const oom = unit === 'si' ? Math.pow(10, 3) : Math.pow(2, 10)

  if (bytes < 0) {
    bytes *= -1
  }

  if (bytes === 0) {
    return `${bytes.toFixed(precision ?? 0)} ${units.units[0]}`
  }

  if (bytes === 1) {
    return `${bytes.toFixed(precision ?? 0)} ${units.singleByte}`
  }

  const absbytes = bytes
  const nth = Math.floor(Math.log(absbytes) / Math.log(oom))
  let result = bytes / Math.pow(oom, nth)

  let suffix = units.units[nth]

  if (!suffix) {
    suffix = units.units[8]
    result = bytes / Math.pow(oom, nth - 1)
  }

  if (typeof precision === 'undefined' && result % 1 === 0) {
    precision = 0
  }

  return `${result.toFixed(precision ?? 2)} ${suffix}`
}
