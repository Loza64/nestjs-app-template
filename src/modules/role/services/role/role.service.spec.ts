import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from '../../domain/entities/role.entity';
import { Permission } from 'src/modules/permission/domain/entities/permission.entity';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            findOneByOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
