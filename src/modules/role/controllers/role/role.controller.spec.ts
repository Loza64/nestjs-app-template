import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from '../../services/role/role.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            softDelete: jest.fn(),
            softRestore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
