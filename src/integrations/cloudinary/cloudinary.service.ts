import { Injectable } from '@nestjs/common';
import {
  CloudinaryService as Service,
  CloudinaryUploadOptions,
} from '@scwar/nestjs-cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly cloudinary: Service) {}

  upload(filePath: Buffer, config: CloudinaryUploadOptions) {
    return this.cloudinary.upload(filePath, config);
  }

  destroy(public_id: string) {
    return this.cloudinary.delete(public_id);
  }
}
