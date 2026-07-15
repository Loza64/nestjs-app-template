import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
@Unique(['path', 'method'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'varchar' })
  path!: string;

  @Column({ type: 'varchar' })
  method!: string;

  @Column({ type: 'varchar', nullable: true })
  title!: string | null;
}