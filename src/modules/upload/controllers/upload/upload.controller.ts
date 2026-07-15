import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Param,
  Delete,
  UploadedFiles,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from '../../services/upload/upload.service';
import { Upload } from '../../domain/entity/upload.entity';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { UploadInterceptor } from 'src/common/interceptors/upload/upload.interceptor';
import { CreateUploadDto } from '../../domain/dto/create.dto';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { storage: memoryStorage() }),
    UploadInterceptor,
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUploadDto,
  ) {
    return this.uploadService.uploadFile(file, body.tags);
  }

  @Post('/many')
  @UseInterceptors(
    FilesInterceptor('files', 10, { storage: memoryStorage() }),
    UploadInterceptor,
  )
  async uploadManyFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateUploadDto,
  ): Promise<Upload[]> {
    return this.uploadService.uploadManyFiles(files, body.tags);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: number): Promise<Upload> {
    return this.uploadService.deleteFile(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number): Promise<Upload> {
    return this.uploadService.findById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page = 1, @Query('size') size = 10): Promise<PaginationParser<Upload>> {
    return this.uploadService.findBy({ page: Number(page), size: Number(size) });
  }
}
