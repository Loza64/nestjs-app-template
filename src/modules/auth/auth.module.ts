import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { SecurityRulesModule } from 'src/security/security.rules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/domain/entity/permission.entity';
import { Role } from '../role/domain/entity/role.entity';
import { User } from '../user/domain/entity/user.entity';
import { CryptoModule } from 'src/integrations/crypto/crypto.module';

@Module({
  imports: [
    ConfigModule,
    SecurityRulesModule,
    CryptoModule,
    TypeOrmModule.forFeature([Permission, Role, User]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }