import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base';
import { Permission } from 'src/modules/permission/domain/entities/permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 50, nullable: false })
  name: string = '';

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @ManyToMany(() => Permission, { eager: false, cascade: false })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: Permission[];
}