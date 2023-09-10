import 'reflect-metadata'
import { DataSource } from 'typeorm'
import {
  Food,
  FoodSource,
  Group,
  Nutrient,
  NutritionValue,
} from './entities/index.js'

export { Food, FoodSource, Group, Nutrient, NutritionValue }

export type InitDbOptions = {
  path: string
}

export async function init(options: InitDbOptions): Promise<DataSource> {
  const db = new DataSource({
    type: 'sqlite',
    database: options.path,
    synchronize: true,
    logging: 'all',
    logger: 'debug',
    entities: [Food, Group, Nutrient, NutritionValue],
    migrations: [],
    subscribers: [],
  })

  return db.initialize()
}
