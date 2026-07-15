import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryService as ExternalCloudinaryService } from '@scwar/nestjs-cloudinary';
import { describe, beforeEach, jest, it, expect } from '@jest/globals';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: ExternalCloudinaryService,
          useValue: {
            upload: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
