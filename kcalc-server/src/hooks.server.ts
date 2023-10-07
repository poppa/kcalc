import 'dotenv/config'
// The above import must come first
import { getenv, EnvMissingError } from '$lib/env'
import { Db } from '@poppanator/kcalc-lib'

const dbOptions: Db.InitDbOptions = {
  path: getenv('KCALC_SQLITE_PATH', EnvMissingError) ?? '',
}

await Db.init(dbOptions)

console.log(`SQLITE DB INITIALIZED:`, dbOptions)
