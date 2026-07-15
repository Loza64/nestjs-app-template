import { User } from '../entity/user.entity';
import { RoleMapper, RoleResponseDto } from 'src/modules/role/domain/mappers/role.mapper';
import { UploadMapper, UploadResponseDto } from 'src/modules/upload/domain/mappers/upload.mapper';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export class UserResponseDto {
  id!: number;
  username!: string;
  name!: string;
  surname!: string;
  email!: string;
  blocked!: boolean;
  role!: RoleResponseDto | null;
  photo!: UploadResponseDto | null;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}

export class UserMapper {
  static toResponse(entity: User): UserResponseDto {
    return {
      id: entity.id,
      username: entity.username,
      name: entity.name,
      surname: entity.surname,
      email: entity.email,
      blocked: entity.blocked,
      role: entity.role ? RoleMapper.toResponse(entity.role) : null,
      photo: entity.photo ? UploadMapper.toResponse(entity.photo) : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    };
  }

  static toResponseList(entities: User[]): UserResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }

  static toPaginatedResponse(pagination: PaginationParser<User>): PaginatedResponseDto<UserResponseDto> {
    return new PaginatedResponseDto(
      this.toResponseList(pagination.data),
      pagination.pagination,
    );
  }
}
