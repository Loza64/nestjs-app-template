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

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) { }

  private preventSelfAction(id: number, profile: User) {
    if (id === profile.id) throw new ForbiddenException('Cannot perform this action on your profile');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: querys) {
    const { page = 1, size = 20, search, blocked, role, isDeleted, sort } = query;

    const baseFilter: FindOptionsWhere<User> = {
      ...(blocked !== undefined ? { blocked } : {}),
      ...(role ? { role: { id: role } } : {}),
    };

    baseFilter.deletedAt = isDeleted ? Not(IsNull()) : IsNull();

    const filters = parseSearch<User>(search, ['name', 'email', 'username', 'surname'], baseFilter);
    const order = parseSort<User>(sort, ['id', 'name', 'email', 'createdAt', 'username']);

    return this.usersService.findBy({
      withDeleted: isDeleted,
      filters,
      relations: { role: true },
      page,
      size,
      order,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneBy({
      filters: { id },
      relations: {
        role: true,
      },
    });
  }

  @UseInterceptors(CleanupOrphanPhotoInterceptor)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @UseInterceptors(CleanupOrphanPhotoInterceptor)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @Profile() profile: User,
  ): Promise<User> {
    this.preventSelfAction(id, profile);
    return this.usersService.update({ id, data });
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Profile() profile: User,
  ): Promise<User> {
    this.preventSelfAction(id, profile);
    return this.usersService.delete(id);
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Profile() profile: User,
  ): Promise<User> {
    this.preventSelfAction(id, profile);
    return this.usersService.softDelete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.softRestore(id);
  }
}
