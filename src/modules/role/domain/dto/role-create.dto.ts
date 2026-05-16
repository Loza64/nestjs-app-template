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
  @IsInt()
  id: number;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique((o: PermissionIdDto) => o.id)
  @ValidateNested({ each: true })
  @Type(() => PermissionIdDto)
  permissions?: PermissionIdDto[];
}
