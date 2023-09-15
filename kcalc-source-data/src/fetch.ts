import { formatBytes, type MaybeFalsy } from '@poppanator/kcalc-lib'
import c from 'chalk'
import { writeFile } from 'fs/promises'
import { Listr } from 'listr2'
import { RawXmlFile, Version } from './lib/index.js'

const ApiEndpoint = `http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel/Naringsvarde/${Version}`

type TaskCtx = {
  data?: string
}

async function* streamAsyncIterable(
  stream: MaybeFalsy<ReadableStream>
): AsyncGenerator<Uint8Array> {
  if (!stream) {
    return
  }

  const reader = stream.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        return
      }

      yield value
    }
  } finally {
    reader.releaseLock()
  }
}

async function download({
  onprogress,
}: {
  onprogress?: (state: { total: number; downloaded: number }) => void
} = {}): Promise<string> {
  const query = await fetch(ApiEndpoint)

  if (onprogress) {
    const totalSize = parseInt(query.headers.get('content-length') ?? '0', 10)
    let downloadedSize = 0
    const u8 = new Uint8Array(totalSize)

    for await (const chunk of streamAsyncIterable(query.body)) {
      u8.set(chunk, downloadedSize)
      downloadedSize += chunk.length
      onprogress({ downloaded: downloadedSize, total: totalSize })
    }

    return new TextDecoder().decode(u8)
  }

  if (!query.ok) {
    throw new Error(`Bad response from download`)
  }

  return query.text()
}

async function fetchApiData() {
  const tasks = new Listr<TaskCtx>([
    {
      title: c.gray('Init download...'),
      async task(ctx) {
        let totalBytes = 0
        const data = await download({
          onprogress: ({ downloaded, total }) => {
            totalBytes = total
            const pcent = (downloaded / total) * 100
            this.title = `Downloading: ${c.cyan(
              Math.floor(pcent) + '%'
            )} of ${c.magenta(formatBytes(total ?? 0))}`
          },
        })

        this.title = `Downloaded ${formatBytes(totalBytes)}`

        ctx.data = data
      },
    },
    {
      title: c.gray('Saving data'),
      async task(ctx) {
        if (!ctx.data) {
          throw new Error(`No data in context`)
        }

        await writeFile(RawXmlFile, ctx.data)
        this.title = `Wrote data to ${RawXmlFile}`
      },
    },
  ])

  try {
    await tasks.run({})
  } catch (err: unknown) {
    console.error('Error:', err)
  }
}

void fetchApiData()
