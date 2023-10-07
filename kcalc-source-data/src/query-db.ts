import { Db } from '@poppanator/kcalc-lib'
import { Like } from 'typeorm'

// FIXME: Resolve DB path from ENV
const db = await Db.init({ path: './data/db.sqlite' })
const dbfoods = db.getRepository(Db.Food)
const res = await dbfoods.find({
  where: {
    name: Like('%kokos%'),
  },
  relations: {
    group: true,
    nutritions: true,
  },
})

console.log(`Res: %O\n\n%d results`, res, res.length)
