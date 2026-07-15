import { Permission } from '../entities/permission.entity';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export class PermissionResponseDto {
  id!: number;
  path!: string;
  method!: string;
  title!: string | null;
}

export class PermissionMapper {
  static toResponse(entity: Permission): PermissionResponseDto {
    return {
      id: entity.id,
      path: entity.path,
      method: entity.method,
      title: entity.title,
    };
  }

  static toResponseList(entities: Permission[]): PermissionResponseDto[] {
    return entities.map((e) => this.toResponse(e));
  }

  static toPaginatedResponse(
    pagination: PaginationParser<Permission>,
  ): PaginatedResponseDto<PermissionResponseDto> {
    return new PaginatedResponseDto(
      this.toResponseList(pagination.data),
      pagination.pagination,
    );
  }
}
