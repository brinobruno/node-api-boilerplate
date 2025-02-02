import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

@Entity()
export class User extends BaseEntity {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'client' })
  role!: 'admin' | 'client'

  @Column({ type: 'boolean', nullable: false, default: true })
  is_active!: boolean

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string

  @Index()
  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  email!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  password!: string

  @Column({ type: 'boolean', nullable: false, default: false })
  default_visibility_allowed!: boolean

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date

  constructor(data: Partial<User>) {
    super()

    // Assign properties
    Object.assign(this, data)
  }
}
