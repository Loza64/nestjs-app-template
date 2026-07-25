import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { SecurityRules } from 'src/security/rules/security.rules';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            profile: jest.fn(),
          },
        },
        {
          provide: SecurityRules,
          useValue: {
            isPublicEndpoint: jest.fn(),
            isAuthEndpoint: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
