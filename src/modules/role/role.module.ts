import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { RoleController } from './controllers/role/role.controller';
import { Role } from './domain/entity/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RolesSeeder } from './seeders/RolesSeeder';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  providers: [RoleService, RolesSeeder],
  controllers: [RoleController]
})
export class RoleModule { }
