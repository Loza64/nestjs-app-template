import { Module } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { CryptoModule } from 'src/integrations/crypto/crypto.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CryptoModule, UploadModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
