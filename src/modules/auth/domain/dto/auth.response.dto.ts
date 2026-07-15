import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { User } from 'src/modules/user/domain/entity/user.entity';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  token: string = '';

  @ApiProperty({ type: () => User, nullable: true })
  @Expose()
  @Type(() => User)
  data: User | null = null;
}
