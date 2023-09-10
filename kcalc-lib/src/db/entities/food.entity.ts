import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm'
import { Group } from './group.entity.js'

export enum FoodSource {
  Auto,
  Manual,
}

@Entity()
export class Food {
  @PrimaryColumn()
  public id!: number

  @Column()
  @Index({ unique: true })
  public name!: string

  @Column()
  public weightGram!: number

  @ManyToOne(() => Group, (g) => g.id)
  public group!: Group

  @Column({ type: 'int' })
  public source!: FoodSource
}
