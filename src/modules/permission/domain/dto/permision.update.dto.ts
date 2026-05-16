import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionUpdateDto {
  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  @IsString()
  title!: string;
}
