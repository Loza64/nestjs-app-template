import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { Permission } from '../../domain/entities/permission.entity';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            upsert: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
