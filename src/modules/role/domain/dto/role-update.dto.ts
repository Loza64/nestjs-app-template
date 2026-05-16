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
  @IsInt()
  id: number;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique((o: PermissionIdDto) => o.id)
  @ValidateNested({ each: true })
  @Type(() => PermissionIdDto)
  permissions?: { id: number }[];
}
