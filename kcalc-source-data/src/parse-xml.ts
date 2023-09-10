import type { PlainObject } from '@poppanator/kcalc-lib'
import { Db } from '@poppanator/kcalc-lib'
import { md5 } from '@poppanator/kcalc-lib/backend'
import { fileExists, readFile, writeFile } from '@poppanator/kcalc-lib/fs'
import { XMLParser } from 'fast-xml-parser'
import { RawXmlFile } from './lib/constants.js'
import type { Livsmedeldatabas } from './raw-types.js'

// FIXME: Resolve DB path from ENV
const db = await Db.init({ path: './data/db.sqlite' })

function generateGroupId(group: string) {
  return md5(group.normalize('NFC').replace(/\s+/, ' ').toLocaleLowerCase())
}

async function parseXmlFile(): Promise<void> {
  const [exists] = (await fileExists(RawXmlFile)).unwrap()

  if (!exists) {
    throw new Error(`Source XML doesn't exist. Run fetch first`)
  }

  console.time('readXml')
  const [data, err] = (await readFile(RawXmlFile)).unwrap()
  console.timeEnd('readXml')

  if (err) {
    console.error('Failed reading RAW XML:', err)
    return
  }

  const parser = new XMLParser()
  console.time('parse')
  const obj = parser.parse(data) as Livsmedeldatabas
  console.timeEnd('parse')

  const foods = obj.LivsmedelDataset.LivsmedelsLista.Livsmedel
  const groups = new Set<string>()
  const nutrionKeys: PlainObject<Set<string | number>> = {}

  console.log(`Num foods:`, foods.length)

  const dbgroup = db.getRepository(Db.Group)
  const dbfood = db.getRepository(Db.Food)

  for (const food of foods) {
    groups.add(food.Huvudgrupp)

    const dbg = await dbgroup.save({
      name: food.Huvudgrupp,
      id: generateGroupId(food.Huvudgrupp),
    })

    // @ts-expect-error
    delete food.Naringsvarden

    const dbf = await dbfood.save({
      group: dbg,
      id: food.Nummer,
      name: food.Namn,
      weightGram: food.ViktGram,
      source: Db.FoodSource.Auto,
    })

    console.log(`dbf:`, dbf)

    // for (const nv of food.Naringsvarden.Naringsvarde) {
    //   for (const [k, v] of Object.entries(nv)) {
    //     if (typeof nutrionKeys[k] === 'undefined') {
    //       nutrionKeys[k] = new Set()
    //     }

    //     nutrionKeys[k].add(v)
    //   }
    // }
  }

  // const nk: PlainObject = {}
  // Object.keys(nutrionKeys).map((k) => (nk[k] = [...nutrionKeys[k]]))
  // await writeFile('nutrition-keys.json', JSON.stringify(nk, null, 2))
  // await writeFile('groups.json', JSON.stringify([...groups].sort(), null, 2))
}

void parseXmlFile()
