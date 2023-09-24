import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm'
import { Nutrient } from './nutrient.entity.js'
import { Food } from './food.entity.js'

@Entity()
export class NutritionValue {
  @PrimaryGeneratedColumn()
  public id!: number

  @ManyToOne(() => Nutrient)
  @JoinColumn({ referencedColumnName: 'id' })
  public nutrient!: Relation<Nutrient>

  @ManyToOne(() => Food, (f) => f.nutritions)
  public food!: Relation<Food>

  @Column('decimal')
  public value!: number

  @Column()
  public unit!: string

  @Column('datetime')
  public lastChanged!: Date

  @Column({ nullable: true })
  public valueType?: string // Vardetyp

  @Column({ nullable: true })
  public origin?: string // Ursprung

  @Column({ nullable: true })
  public publication?: string // Publikation

  @Column({ nullable: true })
  public methodType?: string // Metodtyp

  @Column({ nullable: true })
  public productionMethod?: string // Framtagningsmetod

  @Column({ nullable: true })
  public referenceType?: string // Referenstyp

  @Column({ nullable: true })
  public comment?: string // Kommentar
}
