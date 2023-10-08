export function pojo<T>(inp: T): T {
  return JSON.parse(JSON.stringify(inp))
}
