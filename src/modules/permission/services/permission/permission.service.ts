import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../../domain/entities/permission.entity';
import { DeepPartial, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) { }

  async create(data: DeepPartial<Permission>): Promise<Permission> {
    await this.permissionRepo.upsert(data, ['path', 'method']);
    return this.permissionRepo.findOneOrFail({
      where: { path: data.path as string, method: data.method as string },
    });
  }

  async upsert(data: DeepPartial<Permission>): Promise<void> {
    await this.permissionRepo.upsert(data, ['path', 'method']);
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: DeepPartial<Permission>;
  }): Promise<Permission> {
    const permission = await this.findOneBy({ filters: { id } });
    Object.assign(permission, data);
    return this.permissionRepo.save(permission);
  }

  async findOneBy(params: {
    filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
    relations?: FindOptionsRelations<Permission>;
  }): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({
      where: params.filters,
      relations: params.relations,
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async findBy(params: {
    order?: FindOptionsOrder<Permission>;
    filters: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[];
    relations?: FindOptionsRelations<Permission>;
    page: number;
    size: number;
    withDeleted?: boolean;
  }): Promise<PaginationParser<Permission>> {
    const result = await paginate<Permission>(
      this.permissionRepo,
      { page: params.page, limit: params.size },
      { where: params.filters, relations: params.relations, order: params.order, withDeleted: params.withDeleted },
    );

    return new PaginationParser<Permission>(result)
  }

  async count(
    filters?: FindOptionsWhere<Permission> | FindOptionsWhere<Permission>[],
  ): Promise<number> {
    return this.permissionRepo.count({ where: filters });
  }
}
