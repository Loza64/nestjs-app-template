import { UploadService } from 'src/modules/upload/services/upload/upload.service';
import { CleanupOrphanPhotoInterceptor } from './cleanup-orphan-photo.interceptor';
import { describe, it, jest, expect } from '@jest/globals';

describe('CleanupOrphanPhotoInterceptor', () => {
  it('should be defined', () => {
    const uploadService = {
      deleteFile: jest.fn(),
      findById: jest.fn(),
    } as unknown as UploadService;

    expect(new CleanupOrphanPhotoInterceptor(uploadService)).toBeDefined();
  });
});
