import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { plainToInstance } from 'class-transformer';
import { AuthResponseDto } from '../../domain/dto/response.dto';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { Profile } from 'src/common/decorators/profile';
import {
  ChangePasswordDto,
  LoginDto,
  SignUpDto,
  UpdateProfileDto,
} from '../../domain/dto/payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() data: LoginDto): Promise<AuthResponseDto> {
    const session = await this.authService.login(data.username, data.password);
    return plainToInstance(AuthResponseDto, session);
  }

  @Post('signup')
  async signUp(@Body() data: SignUpDto): Promise<AuthResponseDto> {
    const session = await this.authService.signUp(data);
    return plainToInstance(AuthResponseDto, session);
  }

  @Get('profile')
  profile(@Profile() profile: User): User {
    return profile;
  }

  @Patch('profile')
  async updateProfile(
    @Profile() profile: User,
    @Body() data: UpdateProfileDto,
  ): Promise<User> {
    return this.authService.updateProfile(profile.id, data);
  }

  @Patch('profile/password')
  async updatePassword(
    @Profile() profile: User,
    @Body() data: ChangePasswordDto,
  ): Promise<User> {
    return this.authService.updatePassword(profile.id, data);
  }
}