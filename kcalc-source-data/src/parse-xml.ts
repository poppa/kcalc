import { stat } from 'fs/promises'
import { RawXmlFile } from './lib/constants.js'

async function parseXmlFile(): Promise<void> {
  const res = await stat(RawXmlFile)

  console.log(`*** RES:`, res)
}

void parseXmlFile()
