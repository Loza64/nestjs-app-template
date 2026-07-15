import { UserResponseDto } from 'src/modules/user/domain/mappers/user.mapper';

export class AuthResponseDto {
  token?: string;
  data: UserResponseDto | null = null;
}
