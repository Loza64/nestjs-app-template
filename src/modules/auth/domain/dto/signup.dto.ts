import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'El username es obligatorio' })
  @IsString()
  username?: string = '';

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  name?: string = '';

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  surname?: string = '';

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string = '';

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;
}
