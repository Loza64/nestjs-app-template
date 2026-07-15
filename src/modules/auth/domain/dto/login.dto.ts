import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario123' })
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'secret123' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  password!: string;
}
