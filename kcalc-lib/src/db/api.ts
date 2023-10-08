import { Equal } from 'typeorm'
import { Food, Group, db } from './index.js'
import type { Nullable } from '../type-types.js'

export function groups(): Promise<Group[]> {
  return db()
    .getRepository(Group)
    .find({ order: { name: 'ASC' } })
}

export function group(id: string): Promise<Nullable<Group>> {
  return db().getRepository(Group).findOneBy({ id })
}

export function foodsByGroupId(groupId: string): Promise<Food[]> {
  return db()
    .getRepository(Food)
    .find({
      where: { group: Equal(groupId) },
      order: { name: 'ASC' },
    })
}
