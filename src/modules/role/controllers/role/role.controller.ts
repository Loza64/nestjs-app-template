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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from '../../services/role/role.service';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { Role } from '../../domain/entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../../domain/dto/payload.dto';
import BaseQuerys from 'src/common/dto/base-querys.dto';
import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { parseSearch, parseSort } from 'src/common/helpers/entities.parse';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: BaseQuerys): Promise<PaginationParser<Role>> {
    const { page, size, isDeleted, search, sort } = query;

    const baseFilter: FindOptionsWhere<Role> = {};
    baseFilter.deletedAt = isDeleted ? Not(IsNull()) : IsNull();

    const filters = parseSearch<Role>(search, ['name'], baseFilter);
    const order = parseSort<Role>(sort, ['id', 'name', 'createdAt', 'updatedAt']);

    return this.rolesService.findBy({
      withDeleted: isDeleted,
      filters,
      order,
      relations: { permissions: true },
      page: Number(page),
      size: Number(size),
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOneBy({ filters: { id }, relations: { permissions: true } });
  }

  @Post()
  async create(@Body() data: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto): Promise<Role> {
    return this.rolesService.update({ id, data });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.delete(id);
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.softDelete(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.softRestore(id);
  }
}
