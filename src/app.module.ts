import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { UploadModule } from './modules/upload/upload.module';
import { UploadInterceptorModule } from './common/interceptors/upload/upload.interceptor.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './security/jwt/jwt.guard';
import { PermissionsGuard } from './security/permission/permissions.guard';
import { CryptoModule } from './integrations/crypto/crypto.module';
import { TypeormModule } from './integrations/typeorm/typeorm.module';
import { JsonwebtokenModule } from './integrations/jsonwebtoken/jsonwebtoken.module';
import { RefreshTokenModule } from './modules/refresh_token/refresh_token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JsonwebtokenModule,
    TypeormModule,
    CryptoModule,
    CloudinaryModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    UploadModule,
    UploadInterceptorModule,
    RefreshTokenModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
