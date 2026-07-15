import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { ToBoolean } from '../decorators/dto';

export default class BaseQuerys {
  @IsOptional()
  @IsString()
  @Matches(/^(\w+:(asc|desc))(,\w+:(asc|desc))*$/i, { message: 'sort debe tener formato field:asc,field:desc' })
  sort?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(500)
  size: number = 50;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  isDeleted?: boolean = false;
}
