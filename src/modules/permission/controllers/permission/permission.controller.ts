import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PermissionService } from '../../services/permission/permission.service';
import { PermissionUpdateDto } from '../../domain/dto/permision.update.dto';
import { PermissionMapper, PermissionResponseDto } from '../../domain/mappers/permission.mapper';

@Controller('/permissions')
export class PermissionController {
  constructor(private readonly service: PermissionService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const result = await this.service.findBy({ filters: {}, page, size });
    return PermissionMapper.toPaginatedResponse(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
    const permission = await this.service.findOneBy({ filters: { id } });
    return PermissionMapper.toResponse(permission);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PermissionUpdateDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.service.update({ id, data });
    return PermissionMapper.toResponse(permission);
  }
}
