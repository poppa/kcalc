import { Column, Entity, Index, OneToMany, PrimaryColumn, type Relation } from 'typeorm'
import { Food } from './food.entity.js'

@Entity()
export class Group {
  @PrimaryColumn()
  public id!: string

  @Column({ unique: true })
  @Index({ unique: true })
  public name!: string

  @OneToMany(() => Food, (f) => f.id, { cascade: true })
  public foods?: Array<Relation<Food>>
}
