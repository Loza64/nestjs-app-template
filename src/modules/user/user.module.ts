import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entity/user.entity';
import { CryptoModule } from 'src/integrations/crypto/crypto.module';
import { UploadModule } from '../upload/upload.module';
import { CleanupOrphanPhotoInterceptor } from './interceptors/cleanup-orphan-photo/cleanup-orphan-photo.interceptor';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CryptoModule, UploadModule],
  providers: [UserService, CleanupOrphanPhotoInterceptor],
  controllers: [UserController]
})
export class UserModule { }
