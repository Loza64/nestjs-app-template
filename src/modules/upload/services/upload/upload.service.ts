import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { Upload } from '../../domain/entity/upload.entity';
import 'multer';

@Injectable()
export class UploadService {

  private readonly folder = 'nestjs-app-template';

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
    private readonly mediaService: CloudinaryService,
  ) { }

  private getResourceType(mimetype: string): 'image' | 'video' | 'raw' {
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype === 'application/pdf') return 'raw';
    return 'image';
  }

  async uploadFile(file: Express.Multer.File, tags: string[]): Promise<Upload> {
    const resource_type = this.getResourceType(file.mimetype);
    const isImage = resource_type === 'image';

    const result = await this.mediaService.upload(file.buffer, {
      folder: this.folder,
      tags,
      resource_type,
      phash: true,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...(
        isImage &&
        {
          colors: true,
          faces: true,
          eager: [{ width: 400, height: 400, crop: 'fill', gravity: 'auto' }],
        }
      ),
    });

    const upload = this.uploadRepo.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      originalFilename: file.originalname,
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes ?? null,
      tags: result.tags ?? null,
      placeholder: result.placeholder ?? false,
      phash: result.phash ?? null,
      colors: (result.colors as string[][] | null) ?? null,
      faces: (result.faces) ?? null,
      predominant: (result.predominant) ?? null,
      eager: result.eager?.map((e) => ({
        url: e.url,
        secureUrl: e.secure_url,
        width: e.width,
        height: e.height,
      })) ?? null,
    });
    return this.uploadRepo.save(upload);
  }

  async uploadManyFiles(files: Express.Multer.File[], tags: string[]): Promise<Upload[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, tags)));
  }

  async deleteFile(id: number): Promise<Upload> {
    if (!id) throw new BadRequestException('id is required');

    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) throw new NotFoundException(`File with id ${id} not found`);

    await this.mediaService.destroy(upload.publicId);
    return this.uploadRepo.remove(upload);
  }

  async findById(id: number): Promise<Upload> {
    const upload = await this.uploadRepo.findOne({ where: { id } });
    if (!upload) throw new NotFoundException(`File with id ${id} not found`);
    return upload;
  }

  async findBy(params: { page: number; size: number }): Promise<PaginationParser<Upload>> {
    const result = await paginate<Upload>(this.uploadRepo, {
      page: params.page,
      limit: params.size,
    });
    return new PaginationParser<Upload>(result);
  }
}
