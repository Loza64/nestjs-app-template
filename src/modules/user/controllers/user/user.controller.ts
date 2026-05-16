import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../domain/entity/user.entity';
import { FindUsersQueryDto } from '../../domain/dto/findUsersQueryDto.dto';
import { FindOptionsWhere, ILike, IsNull, Not } from 'typeorm';
import { CreateUserDto } from '../../domain/dto/create.dto';
import { UpdateUserDto } from '../../domain/dto/update.dto';
import { Profile } from 'src/common/decorators/profile';

@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UserService) { }

  private preventSelfAction(id: number, profile: User) {
    if (id === profile.id)
      throw new ForbiddenException(
        'Cannot perform this action on your profile',
      );
  }

  @Get()
  async findAll(@Query() query: FindUsersQueryDto) {
    const { page = 1, size = 20, search, blocked, role, deleted } = query;

    let filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];

    const baseFilter = {
      ...(blocked !== undefined ? { blocked } : {}),
      ...(role ? { role: { id: role } } : {}),
      ...(deleted !== undefined ? { deletedAt: deleted ? Not(IsNull()) : IsNull() } : {}),
    };

    if (search) {
      filters = ['name', 'email', 'username'].map((field) => ({
        [field]: ILike(`%${search}%`),
        ...baseFilter,
      }));
    } else {
      filters = baseFilter;
    }

    return this.usersService.findBy({
      filters,
      relations: { role: true },
      page,
      size,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOneBy({
      filters: { id },
      relations: {
        role: true,
      },
    });
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Put(':id')
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
}
