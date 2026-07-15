import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  ArrayUnique,
  IsInt,
  ValidateNested,
} from 'class-validator';

class PermissionIdDto {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsInt()
  id: number;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Administrador' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ type: () => PermissionIdDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique((o: PermissionIdDto) => o.id)
  @ValidateNested({ each: true })
  @Type(() => PermissionIdDto)
  permissions?: { id: number }[];
}
