import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import JwtPayload from 'src/common/models/jwt.payload';
import { AuthService } from 'src/modules/auth/services/auth/auth.service';
import { SecurityRules } from 'src/security/rules/security.rules';

interface RequestWithRoute extends Request {
  route: { path: string };
  user?: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly rules: SecurityRules,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithRoute>();
    const path = request.route.path;
    const method = request.method.toUpperCase();

    if (this.rules.isPublicEndpoint(path, method)) return true;

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Token missing');

    const token = authHeader.replace('Bearer ', '');
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(token, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authService.profile(payload.sub);

    if (!user)
      throw new UnauthorizedException('The account associated with this token no longer exists.');
    if (user.deletedAt !== null)
      throw new UnauthorizedException('This account is currently deactivated.');
    if (user.blocked)
      throw new UnauthorizedException('This account has been blocked. Please contact support.');
    if (!user.role)
      throw new UnauthorizedException('This account has been without access');
    if (!user.role.active)
      throw new UnauthorizedException('This account acces role  has been disabled');

    request.user = user;

    if (this.rules.isAuthEndpoint(path, method)) return true;

    const allowed = user.role?.permissions?.some((p) => p.path === path && p.method.toUpperCase() === method) || user.role.id === 1; //SUPER_ADMIN tiene acceso a todo

    if (!allowed) throw new ForbiddenException('Permission denied');

    return true;
  }
}