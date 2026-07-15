import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PermissionService } from '../../services/permission/permission.service';
import { PermissionUpdateDto } from '../../domain/dto/permision.update.dto';

@Controller('/permissions')
export class PermissionController {
  constructor(private readonly service: PermissionService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    return this.service.findBy({ filters: {}, page, size });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneBy({ filters: { id } });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PermissionUpdateDto,
  ) {
    return this.service.update({ id, data });
  }
}
