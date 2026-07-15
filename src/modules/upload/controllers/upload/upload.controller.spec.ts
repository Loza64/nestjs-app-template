import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from '../../services/upload/upload.service';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            uploadFile: jest.fn(),
            uploadManyFiles: jest.fn(),
            deleteFile: jest.fn(),
            findById: jest.fn(),
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
