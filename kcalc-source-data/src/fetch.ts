import { formatBytes } from '@poppanator/kcalc-lib'
import c from 'chalk'
import { writeFile } from 'fs/promises'
import got from 'got'
import { Listr } from 'listr2'
import { RawXmlFile, Version } from './lib/index.js'

const ApiEndpoint = `http://www7.slv.se/apilivsmedel/LivsmedelService.svc/Livsmedel/Naringsvarde/${Version}`

type TaskCtx = {
  data?: string
}

async function fetchApiData() {
  const tasks = new Listr<TaskCtx>([
    {
      title: c.gray('Init download...'),
      async task(ctx) {
        const query = got(ApiEndpoint)

        query.on('downloadProgress', (prog) => {
          this.title = `Downloading: ${c.cyan(
            Math.floor(prog.percent * 100) + '%'
          )} of ${c.magenta(formatBytes(prog.total ?? 0))}`
        })

        const res = await query

        this.title = `Downloaded ${formatBytes(res.body.length)}`

        ctx.data = res.body
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
