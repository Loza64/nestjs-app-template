import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SecurityRulesModule } from './security/security.rules.module';
import { UploadModule } from './modules/upload/upload.module';
import { UploadInterceptorModule } from './common/interceptors/upload/upload.interceptor.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './security/jwt/jwt.guard';
import { CryptoModule } from './integrations/crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT')),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: !isProduction,
          ssl: isProduction && { rejectUnauthorized: false },
          extra: {
            max: Number(config.get<string>('DB_POOL_MAX', '20')),
            min: Number(config.get<string>('DB_POOL_MIN', '5')),
            connectionTimeoutMillis: Number(config.get<string>('DB_POOL_ACQUIRE_TIMEOUT', '3000')),
            idleTimeoutMillis: Number(config.get<string>('DB_POOL_IDLE_TIMEOUT', '30000')),
          },
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
          issuer: 'app-name',
          audience: ['web', 'mobile'],
        },
      }),
    }),
    CloudinaryModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SecurityRulesModule,
    UploadModule,
    UploadInterceptorModule,
    CryptoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
