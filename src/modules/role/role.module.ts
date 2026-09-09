import { Module } from '@nestjs/common';
import { Role } from './domain/entity/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from '../permission/permission.module';
import { RolesSeeder } from './seeders/RolesSeeder';
import { RoleService } from './service/role.service';
import { RoleController } from './controller/role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  providers: [RoleService, RolesSeeder],
  controllers: [RoleController],
})
export class RoleModule {}
