import { Role } from '../entities/role.entity';
import {
  PermissionMapper,
  PermissionResponseDto,
} from 'src/modules/permission/domain/mappers/permission.mapper';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export class RoleResponseDto {
  id!: number;
  name?: string;
  description?: string;
  permissions!: PermissionResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

export class RoleMapper {
  static toResponse(entity: Role): RoleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      permissions: entity.permissions
        ? PermissionMapper.toResponseList(entity.permissions)
        : [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseList(entities: Role[]): RoleResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }

  static toPaginatedResponse(
    pagination: PaginationParser<Role>,
  ): PaginatedResponseDto<RoleResponseDto> {
    return new PaginatedResponseDto(
      this.toResponseList(pagination.data),
      pagination.pagination,
    );
  }
}
