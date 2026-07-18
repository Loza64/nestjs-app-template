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
import { CreateRoleDto, UpdateRoleDto } from '../../domain/dto/payload.dto';
import BaseQuerys from 'src/common/dto/base-querys.dto';
import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { Role } from '../../domain/entity/role.entity';
import { RoleMapper } from '../../domain/mappers/role.mapper';
import { RoleResponseDto } from '../../domain/dto/response.dto';
import { parseSearch, parseSort } from 'src/common/helpers/entities.parse';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: BaseQuerys) {
    const { page, size, deleted, search, sort } = query;

    const baseFilter: FindOptionsWhere<Role> = {};
    baseFilter.deletedAt = deleted ? Not(IsNull()) : IsNull();

    const filters = parseSearch<Role>(search, ['name'], baseFilter);
    const order = parseSort<Role>({ sort, forbiddenFields: ['permissions'] });

    const result = await this.rolesService.findBy({
      withDeleted: deleted,
      filters,
      order,
      page: page,
      size: size,
    });

    return RoleMapper.toPaginatedResponse(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    const role = await this.rolesService.findOneBy({ filters: { id }, relations: { permissions: true } });
    return RoleMapper.toResponse(role);
  }

  @Post()
  async create(@Body() data: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.create(data);
    return RoleMapper.toResponse(role);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.update({ id, data });
    return RoleMapper.toResponse(role);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    const role = await this.rolesService.delete(id);
    return RoleMapper.toResponse(role);
  }

  @Patch(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    const role = await this.rolesService.softDelete(id);
    return RoleMapper.toResponse(role);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
    const role = await this.rolesService.softRestore(id);
    return RoleMapper.toResponse(role);
  }
}
