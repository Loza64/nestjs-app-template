import { Test, TestingModule } from '@nestjs/testing';
import { PermissionController } from './permission.controller';
import { PermissionService } from '../../services/permission/permission.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
