import { Injectable, NotFoundException } from '@nestjs/common';
import { ICrudService } from 'src/common/service/crud.service';
import { Role } from '../../domain/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { Permission } from 'src/modules/permission/domain/entities/permission.entity';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoleService implements ICrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) { }

  async create(
    data: DeepPartial<Role> & { permissions?: { id: number }[] },
  ): Promise<Role> {
    let permissions: Permission[] = [];

    if (data.permissions?.length) {
      const ids = data.permissions.map((p) => p.id);
      permissions = await this.permRepo.findBy({ id: In(ids) });
      if (permissions.length !== ids.length)
        throw new NotFoundException('Some permissions not found');
    }

    const role = this.roleRepo.create({ ...data, permissions });
    return this.roleRepo.save(role);
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: DeepPartial<Role> & { permissions?: { id: number }[] };
  }): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: { permissions: true } });
    if (!role) throw new NotFoundException('Role not found');

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'permissions' && value !== undefined)
        role[key] = value ?? role[key];
    });

    if (data.permissions) {
      const ids = data.permissions.map((p) => p.id);
      const permissions = await this.permRepo.findBy({ id: In(ids) });
      if (permissions.length !== ids.length)
        throw new NotFoundException('Some permissions not found');
      role.permissions = permissions;
    }

    return this.roleRepo.save(role);
  }

  async delete(id: number): Promise<Role> {
    const role = await this.findOneBy({ filters: { id } });
    await this.roleRepo.remove(role);
    return role;
  }

  async findOneBy(params: {
    filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[];
    relations?: FindOptionsRelations<Role>;
  }): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: params.filters,
      relations: params.relations,
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findBy(params: {
    filters: FindOptionsWhere<Role> | FindOptionsWhere<Role>[];
    relations?: FindOptionsRelations<Role>;
    page: number;
    size: number;
  }): Promise<PaginationParser<Role>> {
    const result = await paginate<Role>(
      this.roleRepo,
      { page: params.page, limit: params.size },
      { where: params.filters, relations: params.relations },
    );
    return new PaginationParser(result)
  }

  async count(
    filters?: FindOptionsWhere<Role> | FindOptionsWhere<Role>[],
  ): Promise<number> {
    return this.roleRepo.count({ where: filters });
  }
}
