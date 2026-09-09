import { Test, TestingModule } from '@nestjs/testing';
import { CleanupOrphanPhotoInterceptor } from './cleanup-orphan-photo.interceptor';
import { UploadService } from 'src/modules/upload/service/upload.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('CleanupOrphanPhotoInterceptor', () => {
  let interceptor: CleanupOrphanPhotoInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleanupOrphanPhotoInterceptor,
        {
          provide: UploadService,
          useValue: {
            findById: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<CleanupOrphanPhotoInterceptor>(
      CleanupOrphanPhotoInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
