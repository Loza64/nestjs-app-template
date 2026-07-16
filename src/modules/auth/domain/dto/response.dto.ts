import { UserResponseDto } from "src/modules/user/domain/dto/response.dto";

export class AuthResponseDto {
  token?: string;
  data: UserResponseDto | null = null;
}
