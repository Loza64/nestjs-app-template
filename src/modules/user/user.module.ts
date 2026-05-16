import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/domain/entities/permission.entity';
import { Role } from '../role/domain/entities/role.entity';
import { User } from './domain/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
