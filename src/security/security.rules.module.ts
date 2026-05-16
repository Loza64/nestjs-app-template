import { Module } from '@nestjs/common';
import { SecurityRules } from './rules/security.rules';

@Module({
  providers: [SecurityRules],
  exports: [SecurityRules],
})
export class SecurityRulesModule { }