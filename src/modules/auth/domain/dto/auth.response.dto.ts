import { Expose, Type } from 'class-transformer';
import { User } from 'src/modules/user/domain/entity/user.entity';

export class AuthResponseDto {
  @Expose()
  token: string = '';

  @Expose()
  @Type(() => User)
  data: User | null = null;
}
