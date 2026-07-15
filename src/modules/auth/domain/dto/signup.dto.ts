import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'usuario123' })
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @IsString()
  username?: string = '';

  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name?: string = '';

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  surname?: string = '';

  @ApiProperty({ example: 'usuario@example.com' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string = '';

  @ApiProperty({ minLength: 6, example: 'secret123' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
