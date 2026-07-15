// create.dto.ts (sin cambios, todo required)
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import IdDto from 'src/common/dto/id.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario123' })
  @IsString() @IsNotEmpty() username: string = '';

  @ApiProperty({ example: 'Juan' })
  @IsString() @IsNotEmpty() name: string = '';

  @ApiProperty({ example: 'Pérez' })
  @IsString() @IsNotEmpty() surname: string = '';

  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail() @IsNotEmpty() email: string = '';

  @ApiProperty({ minLength: 6, example: 'secret123' })
  @IsString() @MinLength(6) @IsNotEmpty() password: string = '';

  @ApiPropertyOptional({ example: false })
  @IsBoolean() @IsOptional() blocked?: boolean;

  @ApiProperty({ type: () => IdDto })
  @ValidateNested() @Type(() => IdDto) @IsNotEmpty() role?: IdDto;

  @ApiProperty({ type: () => IdDto })
  @ValidateNested() @Type(() => IdDto) @IsNotEmpty() profile?: IdDto;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }