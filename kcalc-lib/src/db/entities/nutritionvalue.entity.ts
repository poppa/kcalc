import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Nutrient } from './nutrient.entity.js'

@Entity()
export class NutritionValue {
  @PrimaryGeneratedColumn()
  public id!: number

  @OneToOne(() => Nutrient)
  public nutrient!: Nutrient

  @Column('decimal')
  public value!: number

  @Column()
  public unit!: string

  @Column('datetime')
  public lastChanged!: Date

  @Column({ nullable: true })
  public publication!: string

  @Column({ nullable: true })
  public productionMethod!: string

  @Column({ nullable: true })
  public methodType!: string
}
