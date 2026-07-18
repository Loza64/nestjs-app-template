import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission/permission.service';
import { Permission } from './domain/entity/permission.entity';
import { DiscoveryModule } from '@nestjs/core';
import { SecurityRulesModule } from 'src/security/security.rules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsSeeder } from './seeders/permissions.seeder';
import { PermissionController } from './controllers/permission/permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), DiscoveryModule, SecurityRulesModule],
  providers: [PermissionService, PermissionsSeeder],
  controllers: [PermissionController],
  exports: [PermissionService]
})
export class PermissionModule { }
