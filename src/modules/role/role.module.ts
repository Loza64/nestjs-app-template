import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { RoleController } from './controllers/role/role.controller';
import { Role } from './domain/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/domain/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule { }
