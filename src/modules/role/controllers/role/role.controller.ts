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
} from '@nestjs/common';
import { RoleService } from '../../services/role/role.service';
import { PaginationParse } from 'src/common/parser/pagination.parse';
import { Role } from '../../domain/entities/role.entity';
import { CreateRoleDto } from '../../domain/dto/role-create.dto';
import { UpdateRoleDto } from '../../domain/dto/role-update.dto';

@Controller('api/roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) { }

  @Get()
  async findBy(
    @Query() query: Record<string, string>,
  ): Promise<PaginationParse<Role>> {
    const { page = '1', size = '50' } = query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    return this.rolesService.findBy({
      filters: {},
      relations: {},
      page: pageNumber,
      size: pageSize,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.findOneBy({ filters: { id }, relations: { permissions: true } });
  }

  @Post()
  async create(@Body() data: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRoleDto): Promise<Role> {
    return this.rolesService.update({ id, data });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.delete(id);
  }
}

