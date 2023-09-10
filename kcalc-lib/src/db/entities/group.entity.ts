import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Group {
  @PrimaryColumn()
  public id!: string

  @Column({ unique: true })
  public name!: string
}
