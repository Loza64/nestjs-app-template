import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Role } from '../domain/entity/role.entity';

const DEFAULT_ROLES: DeepPartial<Role>[] = [
  { name: 'SUPER_ADMIN' },
  { name: 'ADMIN' },
];

@Injectable()
export class RolesSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    await this.repo.upsert(DEFAULT_ROLES, {
      conflictPaths: ['name'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}