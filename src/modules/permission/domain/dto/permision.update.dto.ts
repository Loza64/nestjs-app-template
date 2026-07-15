import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionUpdateDto {
  @ApiProperty({ example: 'Crear usuarios' })
  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  @IsString()
  title!: string;
}
