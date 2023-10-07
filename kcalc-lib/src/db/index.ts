import 'reflect-metadata'
import { DataSource } from 'typeorm'
import {
  Food,
  FoodSource,
  Group,
  Nutrient,
  NutritionValue,
} from './entities/index.js'
import type { Maybe } from '../type-types.js'

export { Food, FoodSource, Group, Nutrient, NutritionValue }

export type InitDbOptions = {
  path: string
}

let db_: Maybe<DataSource>

export function db(): DataSource {
  if (!db_) {
    throw new Error(`You must call "init()" first to initialize the DB object`)
  }

  if (!db_.isInitialized) {
    throw new Error(`You must await the DB initialization before calling db()`)
  }

  return db_
}

export async function init(options: InitDbOptions): Promise<DataSource> {
  if (db_) {
    return db()
  }

  db_ = new DataSource({
    type: 'sqlite',
    database: options.path,
    synchronize: true,
    logging: 'all',
    logger: 'debug',
    entities: [Food, Group, Nutrient, NutritionValue],
    migrations: [],
    subscribers: [],
  })

  return db_.initialize()
}
