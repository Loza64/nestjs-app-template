import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import IdDto from 'src/common/dto/id.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string = '';

  @IsOptional()
  @IsArray()
  @ArrayUnique((o: IdDto) => o.id)
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  permissions?: IdDto[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) { }