import { Injectable, NotFoundException } from '@nestjs/common';
import { ICrudService } from 'src/common/service/crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/role/domain/entities/role.entity';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationParse } from 'src/common/parser/pagination.parse';
import { paginate } from 'nestjs-typeorm-paginate';
import { User } from '../../domain/entity/user.entity';

@Injectable()
export class UserService implements ICrudService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) { }

  async create(data: DeepPartial<User>): Promise<User> {
    let role: Role | null = null;

    if (data.role?.id) {
      role = await this.roleRepo.findOne({ where: { id: data.role.id } });
      if (!role) throw new NotFoundException('Role not found');
    }

    const user = this.userRepo.create({ ...data, role });
    return this.userRepo.save(user);
  }

  async update({
    id,
    data,
  }: {
    id: number;
    data: DeepPartial<User>;
  }): Promise<User> {
    const user = await this.findOneBy({ filters: { id } });

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) user[key] = value;
    });

    if (data.role?.id) {
      const roleEntity = await this.roleRepo.findOne({
        where: { id: data.role.id },
      });
      if (!roleEntity) throw new NotFoundException('Role not found');
      user.role = roleEntity;
    }

    return this.userRepo.save(user);
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOneBy({ filters: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.remove(user);
    return user;
  }

  async findOneBy(params: {
    filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    relations?: FindOptionsRelations<User>;
  }): Promise<User> {
    const user = await this.userRepo.findOne({
      where: params.filters,
      relations: params.relations,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findBy(params: {
    filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    relations?: FindOptionsRelations<User>;
    page: number;
    size: number;
  }): Promise<PaginationParse<User>> {
    const result = await paginate<User>(
      this.userRepo,
      { page: params.page, limit: params.size },
      { where: params.filters, relations: params.relations },
    );
    return new PaginationParse(result)
  }

  async count(
    filters?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<number> {
    return this.userRepo.count({ where: filters });
  }
}
