import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../domain/entity/user.entity';
import { querys } from '../../domain/dto/querys';
import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../../domain/dto/payload.dto';
import { Profile } from 'src/common/decorators/profile';
import { parseSearch, parseSort } from 'src/common/helpers/entities.parse';
import { CleanupOrphanPhotoInterceptor } from '../../interceptors/cleanup-orphan-photo/cleanup-orphan-photo.interceptor';
import { UserMapper } from '../../domain/mappers/user.mapper';
import { UserResponseDto } from '../../domain/dto/response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) { }

  private preventSelfAction(id: number, profile: User) {
    if (id === profile.id) throw new ForbiddenException('Cannot perform this action on your profile');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: querys) {
    const { page = 1, size = 20, search, blocked, role, deleted, sort } = query;

    const baseFilter: FindOptionsWhere<User> = {
      ...(blocked !== undefined ? { blocked } : {}),
      ...(role ? { role: { id: role } } : {}),
    };

    baseFilter.deletedAt = deleted ? Not(IsNull()) : IsNull();

    const filters = parseSearch<User>(search, ['name', 'email', 'username', 'surname'], baseFilter);
    const order = parseSort<User>({
      sort,
      forbiddenFields: ['password']
    });

    const result = await this.usersService.findBy({
      withDeleted: deleted,
      filters,
      relations: { role: true, photo: true },
      page,
      size,
      order,
    });

    return UserMapper.toPaginatedResponse(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.findOneBy({
      filters: { id },
      relations: {
        role: true,
        photo: true
      },
    });
    return UserMapper.toResponse(user);
  }

  @UseInterceptors(CleanupOrphanPhotoInterceptor)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return UserMapper.toResponse(user);
  }

  @UseInterceptors(CleanupOrphanPhotoInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @Profile() profile: User,
  ): Promise<UserResponseDto> {
    this.preventSelfAction(id, profile);
    const user = await this.usersService.update({ id, data });
    return UserMapper.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Profile() profile: User): Promise<UserResponseDto> {
    this.preventSelfAction(id, profile);
    const user = await this.usersService.softDelete(id);
    return UserMapper.toResponse(user);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.usersService.softRestore(id);
    return UserMapper.toResponse(user);
  }
}
