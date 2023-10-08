import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm'
import { Food } from './food.entity.js'

@Entity()
export class Group {
  @PrimaryColumn()
  public id!: string

  @Column({ unique: true })
  @Index({ unique: true })
  public name!: string
}
