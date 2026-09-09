import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './domain/entity/upload.entity';
import { CloudinaryModule } from 'src/integrations/cloudinary/cloudinary.module';
import { UploadInterceptorModule } from 'src/common/interceptors/upload/upload.interceptor.module';
import { UploadService } from './service/upload.service';
import { UploadController } from './controller/upload.controller';

@Module({
  imports: [
    CloudinaryModule,
    UploadInterceptorModule,
    TypeOrmModule.forFeature([Upload]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
