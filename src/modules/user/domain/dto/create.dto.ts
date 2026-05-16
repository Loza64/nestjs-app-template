import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string = '';

  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsString()
  @IsNotEmpty()
  surname: string = '';

  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string = '';

  @IsInt()
  @IsNotEmpty()
  role: { id: number } = { id: 1 };
}
