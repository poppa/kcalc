import { Db, pojo } from '@poppanator/kcalc-lib'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
  const groups = await Db.groups()

  return {
    groups: pojo(groups),
  }
}
