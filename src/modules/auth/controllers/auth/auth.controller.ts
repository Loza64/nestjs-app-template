import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { AuthResponseDto } from '../../domain/dto/response.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Profile } from 'src/common/decorators/profile';
import {
  ChangePasswordDto,
  LoginDto,
  SignUpDto,
  UpdateProfileDto,
} from '../../domain/dto/payload.dto';
import { UserMapper, UserResponseDto } from 'src/modules/user/domain/mappers/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<AuthResponseDto> {
    const session = await this.authService.login(data.username, data.password);
    return { token: session.token, data: UserMapper.toResponse(session.data as User) };
  }

  @Post('signup')
  async signUp(@Body() data: SignUpDto): Promise<AuthResponseDto> {
    const session = await this.authService.signUp(data);
    return { token: session.token, data: UserMapper.toResponse(session.data as User) };
  }

  @Get('profile')
  profile(@Profile() profile: User): UserResponseDto {
    return UserMapper.toResponse(profile);
  }

  @Patch('profile')
  async updateProfile(
    @Profile() profile: User,
    @Body() data: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const updated = await this.authService.updateProfile(profile.id, data);
    return UserMapper.toResponse(updated);
  }

  @Patch('profile/password')
  async updatePassword(
    @Profile() profile: User,
    @Body() data: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    const updated = await this.authService.updatePassword(profile.id, data);
    return UserMapper.toResponse(updated);
  }
}
