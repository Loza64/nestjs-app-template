import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
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

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
