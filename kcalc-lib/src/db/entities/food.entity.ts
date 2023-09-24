import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm'
import { Group } from './group.entity.js'
import { NutritionValue } from './nutritionvalue.entity.js'


export enum FoodSource {
  Imported,
  Manual,
}

@Entity()
export class Food {
  @PrimaryColumn()
  public id!: number

  @Column({ unique: true })
  @Index({ unique: true })
  public name!: string

  @Column()
  public weightGram!: number

  @ManyToOne(() => Group)
  public group!: Relation<Group>

  @Column({ type: 'int' })
  public source!: FoodSource

  @OneToMany(() => NutritionValue, (v) => v.food, { cascade: true })
  public nutritions!: Array<Relation<NutritionValue>>
}
