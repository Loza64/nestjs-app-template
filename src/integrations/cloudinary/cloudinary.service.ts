import { Injectable } from '@nestjs/common';
import { CloudinaryService as Service, CloudinaryUploadOptions } from '@scwar/nestjs-cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly cloudinary: Service) { }

  async upload(filePath: Buffer, config: CloudinaryUploadOptions) {
    return await this.cloudinary.upload(filePath, config);
  }

  async destroy(public_id: string) {
    return await this.cloudinary.delete(public_id);
  }
}
