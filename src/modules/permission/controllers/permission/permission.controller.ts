import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PermissionService } from '../../services/permission/permission.service';
import { PermissionUpdateDto } from '../../domain/dto/permision.update.dto';

@Controller('/api/permissions')
export class PermissionController {
  constructor(private readonly service: PermissionService) { }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PermissionUpdateDto,
  ) {
    return this.service.update({ id, data });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneBy({ filters: { id } });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    return this.service.findBy({ filters: {}, page, size });
  }
}
