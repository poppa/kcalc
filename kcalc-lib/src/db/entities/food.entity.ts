import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Group } from './group.entity.js'
import { NutritionValue } from './nutritionvalue.entity.js'

export enum FoodSource {
  Auto,
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

  @ManyToOne(() => Group, (g) => g.id)
  public group!: Group

  @Column({ type: 'int' })
  public source!: FoodSource

  @ManyToMany(() => NutritionValue, (v) => v.id)
  @JoinTable()
  public nutritions!: NutritionValue[]
}
