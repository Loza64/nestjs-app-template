import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationParse } from 'src/common/parser/pagination.parse';
import { Upload } from '../../domain/entity/upload.entity';
import 'multer';

@Injectable()
export class UploadService {
  private readonly defaultFolder = 'nestjs';
  private readonly defaultTags = ['nestjs-upload'];

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
    private readonly mediaService: CloudinaryService,
  ) { }

  async uploadFile(file: Express.Multer.File): Promise<Upload> {
    let resource_type: 'image' | 'video' | 'raw' | 'auto' = 'image';

    if (file.mimetype.startsWith('video/')) resource_type = 'video';
    if (file.mimetype === 'application/pdf') resource_type = 'raw';

    const result = await this.mediaService.upload(file.buffer, {
      folder: this.defaultFolder,
      tags: this.defaultTags,
      resource_type,
    });

    const upload = this.uploadRepo.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      originalFilename: file.originalname,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      tags: result.tags,
      placeholder: result.placeholder,
      phash: result.phash
    });

    return this.uploadRepo.save(upload);
  }

  async uploadManyFiles(files: Express.Multer.File[]): Promise<Upload[]> {
    return Promise.all(files.map(file => this.uploadFile(file)));
  }

  async deleteFile(id: number): Promise<Upload> {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    await this.mediaService.destroy(upload.publicId);
    return this.uploadRepo.remove(upload);
  }

  async findById(id: number): Promise<Upload> {
    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return upload;
  }

  async findBy(params: { page: number; size: number }): Promise<PaginationParse<Upload>> {
    const result = await paginate<Upload>(this.uploadRepo, { page: params.page, limit: params.size });

    return new PaginationParse<Upload>(result)
  }
}