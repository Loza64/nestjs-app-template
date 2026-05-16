import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean

  @IsInt()
  @IsOptional()
  role?: { id: number };
}
