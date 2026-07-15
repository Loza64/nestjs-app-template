import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PermissionIdDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  id: number;
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ type: () => PermissionIdDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique((o: PermissionIdDto) => o.id)
  @ValidateNested({ each: true })
  @Type(() => PermissionIdDto)
  permissions?: PermissionIdDto[];
}
