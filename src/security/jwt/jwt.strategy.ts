import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import JwtPayload from 'src/common/models/jwt.payload';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/services/auth/auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: AuthService) {
    super();
  }

  async validate({ sub }: JwtPayload): Promise<User> {
    const user = await this.usersService.profile(sub);

    if (!user) {
      throw new UnauthorizedException(
        'The account associated with this token no longer exists.',
      );
    }

    if (user.deletedAt !== null) {
      throw new UnauthorizedException(
        'This account is currently deactivated.',
      );
    }

    if (user.blocked) {
      throw new UnauthorizedException(
        'This account has been blocked. Please contact support.',
      );
    }

    return user;
  }
}
