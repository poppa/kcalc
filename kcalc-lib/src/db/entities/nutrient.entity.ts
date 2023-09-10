import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Nutrient {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ unique: true })
  public name!: string

  @Column({ unique: true })
  public abbreviation!: string
}
