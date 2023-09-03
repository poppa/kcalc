import { fileExists } from '@poppanator/kcalc-lib'
import { RawXmlFile } from './lib/constants.js'

async function parseXmlFile(): Promise<void> {
  const [exists] = (await fileExists(RawXmlFile)).unwrap()

  if (!exists) {
    throw new Error(`Source XML doesn't exist. Run fetch first`)
  }

  console.log(`*** RES:`, exists)
}

void parseXmlFile()
