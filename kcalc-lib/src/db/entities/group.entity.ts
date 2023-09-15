import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity()
export class Group {
  @PrimaryColumn()
  public id!: string

  @Column({ unique: true })
  @Index({ unique: true })
  public name!: string
}
