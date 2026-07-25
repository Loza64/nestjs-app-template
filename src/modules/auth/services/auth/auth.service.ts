import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import JwtPayload from 'src/common/models/jwt.payload';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { AuthResponseDto } from '../../domain/dto/response.dto';
import { CryptoService } from 'src/integrations/crypto/crypto.service';
import {
  ChangePasswordDto,
  SignUpDto,
  UpdateProfileDto,
} from '../../domain/dto/payload.dto';
import { RefreshTokenService } from 'src/modules/refresh_token/service/refresh-token.service';

const DEFAULT_ROLE_ID = 1;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  private signToken(userId: number): string {
    return this.jwtService.sign<JwtPayload>({ sub: userId });
  }

  async signUp(data: SignUpDto): Promise<AuthResponseDto> {
    const existing = await this.repo.findOne({ where: [{ username: data.username }, { email: data.email }] });

    if (existing) throw new ConflictException('Username o email ya están en uso');

    const hashedPassword = await this.cryptoService.encrypt(data.password);

    const user = this.repo.create({
      ...data,
      password: hashedPassword,
      role: { id: DEFAULT_ROLE_ID },
    });

    const savedUser = await this.repo.save(user);
    const refreshToken = await this.refreshTokenService.issue(savedUser);

    return {
      token: this.signToken(savedUser.id),
      refreshToken,
      data: savedUser,
    };
  }

  async login(username: string, password: string): Promise<AuthResponseDto> {
    const user = await this.repo.findOne({
      where: { username },
      relations: { role: { permissions: true } },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (user.deletedAt !== null) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.blocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    const validPassword = await this.cryptoService.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const refreshToken = await this.refreshTokenService.issue(user);

    return {
      token: this.signToken(user.id),
      refreshToken,
      data: user,
    };
  }

  async refresh(incomingToken: string): Promise<AuthResponseDto> {
    const { refreshToken, user } = await this.refreshTokenService.rotate(incomingToken);

    return {
      token: this.signToken(user.id),
      refreshToken,
      data: user,
    };
  }

  async logout(incomingToken: string): Promise<void> {
    await this.refreshTokenService.revoke(incomingToken);
  }

  async profile(id: number): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations: { role: { permissions: true } },
    });
  }

  async updateProfile(id: number, data: UpdateProfileDto): Promise<User> {
    const profile = await this.repo.findOne({ where: { id }, relations: { role: true } });
    if (!profile) throw new NotFoundException('Profile not found');

    Object.assign(profile, data);
    return this.repo.save(profile);
  }

  async updatePassword(id: number, data: ChangePasswordDto): Promise<User> {
    const user = await this.repo.findOne({ where: { id }, relations: { role: true, photo: true } });
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.cryptoService.compare(data.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('La contraseña actual es incorrecta');

    user.password = await this.cryptoService.encrypt(data.newPassword);
    return this.repo.save(user);
  }
}