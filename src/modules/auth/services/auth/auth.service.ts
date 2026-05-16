import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/modules/role/domain/entities/role.entity';
import JwtPayload from 'src/common/models/jwt.payload';
import { User } from 'src/modules/user/domain/entity/user.entity';
import { AuthResponseDto } from '../../domain/dto/auth.response.dto';
import { CryptoService } from 'src/integrations/crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) { }

  private signToken(userId: number): string {
    return this.jwtService.sign<JwtPayload>({ sub: userId });
  }

  async signUp(data: Partial<User>): Promise<AuthResponseDto> {
    if (!data.password) {
      throw new UnauthorizedException('Password is required');
    }

    const hashedPassword = await this.cryptoService.encrypt(data.password);

    const role = await this.roleRepo.findOne({ where: { id: 2 } });

    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
      role: role ?? undefined,
    });

    const savedUser = await this.userRepo.save(user);

    return {
      token: this.signToken(savedUser.id),
      data: savedUser,
    };
  }

  async login(username: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepo.findOne({
      where: [{ username }],
      relations: { role: { permissions: true } },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (user.blocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    const validPassword = await this.cryptoService.compare(
      password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    return {
      token: this.signToken(user.id),
      data: user,
    };
  }

  async profile(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: { role: { permissions: true } }
    });
  }
}