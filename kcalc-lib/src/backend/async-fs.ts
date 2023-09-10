import type {
  PathLike,
  Stats,
  RmDirOptions,
  ObjectEncodingOptions,
  Mode,
  OpenMode,
  CopyOptions,
} from 'fs'
import { promises } from 'fs'
import type { AsyncResult } from 'safe-result'
import { success, failure } from 'safe-result'
import type { Abortable } from 'events'
import type { GlobOptions } from 'glob'
import { glob as $glob } from 'glob'
import { rimraf as _rimraf } from 'rimraf'
import { join } from 'path'

type RimrafOptions = Parameters<typeof _rimraf>[1]

export type WriteFileOptions =
  | BufferEncoding
  | (ObjectEncodingOptions & {
      mode?: Mode | undefined
      flag?: OpenMode | undefined
    } & Abortable)
  | null
  | undefined

/**
 * Glob search for files. This is an async wrapper for
 * {@link https://www.npmjs.com/package/glob | glob}
 *
 * @param globPath - Glob pattern to match
 * @param options - Glob options
 */
export async function glob(
  globPath: string,
  options?: GlobOptions
): AsyncResult<string[]> {
  try {
    const res = await $glob(globPath, options ?? {})
    return success(res.map((r) => r.toString()))
  } catch (err: unknown) {
    return failure(err as Error)
  }
}

export async function rimraf(
  path: PathLike,
  options?: RimrafOptions
): AsyncResult<boolean> {
  try {
    await _rimraf(path.toString(), options ?? {})
    return success(true)
  } catch (err: unknown) {
    return failure(err as Error)
  }
}

export async function fileExists(p: PathLike): AsyncResult<boolean> {
  try {
    await promises.stat(p)
    return success(true)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function fileStat(p: PathLike): AsyncResult<Stats> {
  try {
    const st = await promises.lstat(p)
    return success(st)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function isDir(p: PathLike): AsyncResult<boolean> {
  const r = await fileStat(p)
  return r.success ? success(r.result.isDirectory()) : r
}

export async function isFile(p: PathLike): AsyncResult<boolean> {
  const r = await fileStat(p)
  return r.success ? success(r.result.isFile()) : r
}

export async function mkDir(
  p: PathLike,
  recursive = false
): AsyncResult<boolean> {
  try {
    await promises.mkdir(p, { recursive })
    return success(true)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function readDir(p: PathLike): AsyncResult<string[]> {
  try {
    const r = await promises.readdir(p)
    return success(r)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function readFile(f: PathLike): AsyncResult<Buffer> {
  try {
    const r = await promises.readFile(f)
    return success(r)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function writeFile(
  p: PathLike,
  data: string | Buffer,
  options?: WriteFileOptions
): AsyncResult<boolean> {
  try {
    await promises.writeFile(p, data, options)
    return success(true)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function rmDir(
  path: PathLike,
  opts?: RmDirOptions
): AsyncResult<boolean> {
  try {
    if (await isDir(path)) {
      await promises.rmdir(path, opts)
      return success(true)
    }

    return success(false)
  } catch (e: unknown) {
    return failure(e as Error)
  }
}

export async function rmFile(path: PathLike): AsyncResult<boolean> {
  try {
    await promises.unlink(path)
    return success(true)
  } catch (err: unknown) {
    return failure(err as Error)
  }
}

export async function copyFile(
  source: PathLike,
  dest: PathLike,
  mode?: number
): AsyncResult<boolean> {
  try {
    await promises.copyFile(source, dest, mode)
    return success(true)
  } catch (err: unknown) {
    return failure(err as Error)
  }
}

export async function cp(
  source: PathLike,
  dest: PathLike,
  opts?: CopyOptions
): AsyncResult<boolean> {
  try {
    if ('cp' in promises) {
      await promises.cp(source.toString(), dest.toString(), opts)
      return success(true)
    }

    const sourceStat = await fileStat(source)

    if (sourceStat.success) {
      if (sourceStat.result.isDirectory()) {
        const destStat = await fileStat(dest)

        if (!destStat.success) {
          const made = await mkDir(dest)

          if (made.failure) {
            return made
          }
        }

        const contents = await readDir(source)

        if (contents.success) {
          for (const file of contents.result) {
            const fullSourcePath = join(source.toString(), file)
            const fullDestPath = join(dest.toString(), file)

            const sourceIsDir = await isDir(fullSourcePath)

            if (sourceIsDir.success) {
              if (sourceIsDir.result) {
                await cp(fullSourcePath, fullDestPath)
              } else {
                await copyFile(fullSourcePath, fullDestPath)
              }
            } else {
              return sourceIsDir
            }
          }
        } else {
          return contents
        }
      } else {
        return await copyFile(source, dest)
      }
    } else {
      return sourceStat
    }

    return success(true)
  } catch (err: unknown) {
    return failure(err as Error)
  }
}

export async function mv(
  source: PathLike,
  dest: PathLike
): AsyncResult<boolean> {
  try {
    await promises.rename(source, dest)
    return success(true)
  } catch (err: unknown) {
    return failure(err as Error)
  }
}
