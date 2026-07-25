import { Test, TestingModule } from '@nestjs/testing';
import { SecurityRules } from './security.rules';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('SecurityRules', () => {
  let rules: SecurityRules;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityRules],
    }).compile();

    rules = module.get<SecurityRules>(SecurityRules);
  });

  it('should be defined', () => {
    expect(rules).toBeDefined();
  });
});
