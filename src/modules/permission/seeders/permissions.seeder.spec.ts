import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionsSeeder } from './permissions.seeder';
import { PermissionService } from '../service/permission.service';
import { SecurityRules } from 'src/security/rules/security.rules';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('PermissionsSeeder', () => {
  let seeder: PermissionsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsSeeder,
        {
          provide: DiscoveryService,
          useValue: {
            getControllers: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PermissionService,
          useValue: {
            upsert: jest.fn(),
          },
        },
        {
          provide: SecurityRules,
          useValue: {
            normalizePath: jest.fn(),
            isPublicEndpoint: jest.fn(),
            isAuthEndpoint: jest.fn(),
            methodMap: {},
          },
        },
      ],
    }).compile();

    seeder = module.get<PermissionsSeeder>(PermissionsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });
});
