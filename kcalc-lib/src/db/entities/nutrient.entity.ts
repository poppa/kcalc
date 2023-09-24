import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Nutrient {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ unique: true })
  @Index({ unique: true })
  public abbreviation!: string

  @Column({ unique: true })
  @Index({ unique: true })
  public name!: string
}
