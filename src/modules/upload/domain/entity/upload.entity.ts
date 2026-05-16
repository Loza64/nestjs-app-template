import { BaseEntity } from 'src/common/entity/base';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity('uploads')
export class Upload extends BaseEntity {

  @Column({ type: 'varchar', unique: true, nullable: false })
  publicId: string = '';

  @Column({ type: 'varchar', nullable: false })
  phash: string = '';

  @Column({ type: 'varchar', nullable: false })
  url: string = '';

  @Column({ type: 'varchar', nullable: true })
  secureUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  resourceType?: string;

  @Column({ type: 'varchar', nullable: true })
  format?: string;

  @Column({ type: 'varchar', nullable: true })
  originalFilename?: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'bigint', nullable: true })
  bytes?: number;

  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[];

  @Column({ type: 'boolean', default: false })
  placeholder: boolean = false;
}