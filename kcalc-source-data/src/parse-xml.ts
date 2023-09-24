import { Db, assertError } from '@poppanator/kcalc-lib'
import { md5 } from '@poppanator/kcalc-lib/backend'
import { fileExists, readFile } from '@poppanator/kcalc-lib/fs'
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

  console.log(`Num foods:`, foods.length)

  const dbnutrient = db.getRepository(Db.Nutrient)
  const nutrients = new Map<string, Db.Nutrient>()

  for (const food of foods) {
    groups.add(food.Huvudgrupp)

    const dbg = {
      name: food.Huvudgrupp,
      id: generateGroupId(food.Huvudgrupp),
    }

    const nutritionValues: Db.NutritionValue[] = []

    for (const nv of food.Naringsvarden.Naringsvarde) {
      let nutrient = nutrients.get(nv.Forkortning)

      if (!nutrient) {
        nutrient =
          (await dbnutrient.findOne({
            where: { abbreviation: nv.Forkortning },
          })) ?? undefined

        if (!nutrient) {
          try {
            nutrient = await dbnutrient.save({
              abbreviation: nv.Forkortning,
              name: nv.Namn,
            })
          } catch (err: unknown) {
            console.error('Error:', err)
            console.log(`At nutrient:`, nv)
            process.exit(1)
          }
        }

        if (!nutrient) {
          throw new Error(`Failed to resolve Nutrient for ${nv.Forkortning}`)
        } else {
          nutrients.set(nutrient.abbreviation, nutrient)
        }
      }

      const dbnv = new Db.NutritionValue()

      dbnv.nutrient = nutrient
      dbnv.unit = nv.Enhet
      dbnv.lastChanged = new Date(Date.parse(nv.SenastAndrad))
      dbnv.value =
        typeof nv.Varde === 'string' ? parseFloat(nv.Varde) : nv.Varde
      dbnv.comment = nv.Kommentar?.toString()
      dbnv.methodType = nv.Metodtyp
      dbnv.origin = nv.Ursprung
      dbnv.productionMethod = nv.Framtagningsmetod
      dbnv.publication = nv.Publikation
      dbnv.referenceType = nv.Referenstyp
      dbnv.valueType = nv.Vardetyp

      nutritionValues.push(dbnv)
    }

    try {
      await db.manager.save(nutritionValues)
    } catch (err: unknown) {
      console.error('Error:', err)
      console.log(`At nutrition value: %O`, nutritionValues[0])
      process.exit(1)
    }

    const dbf = new Db.Food()

    dbf.group = dbg
    dbf.id = food.Nummer
    dbf.name = food.Namn
    dbf.weightGram = food.ViktGram
    dbf.source = Db.FoodSource.Imported
    dbf.nutritions = nutritionValues

    try {
      const saveRes = await db.manager.save(dbf)
      console.log(`Food(%d): %s`, saveRes.id, saveRes.name)
    } catch (err: unknown) {
      assertError(err)
      console.error('Error:', err.message)
      // @ts-expect-error
      delete dbf.nutritions
      console.error('At: ', dbf)
      process.exit(1)
    }
  }
}

void parseXmlFile()
