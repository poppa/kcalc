import { status } from '@poppanator/http-constants'
import { Db, pojo } from '@poppanator/kcalc-lib'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const [group, foods] = await Promise.allSettled([
    Db.group(params.gid),
    Db.foodsByGroupId(params.gid),
  ])

  if (group.status === 'rejected') {
    throw error(status.InternalServerError, 'Failed fetching group')
  }

  if (foods.status === 'rejected') {
    throw error(status.InternalServerError, 'Failed fetching foods for group')
  }

  return {
    group: pojo(group.value),
    foods: pojo(foods.value),
  }
}
