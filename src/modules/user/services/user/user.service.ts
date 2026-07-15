import { Injectable, NotFoundException } from '@nestjs/common';
import { ICrudService } from 'src/common/service/crud.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationParser } from 'src/common/parser/pagination.parser';
import { paginate } from 'nestjs-typeorm-paginate';
import { CryptoService } from 'src/integrations/crypto/crypto.service';
import { User } from '../../domain/entity/user.entity';
import { UploadService } from 'src/modules/upload/services/upload/upload.service';

@Injectable()
export class UserService implements ICrudService<User> {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly upload: UploadService,
    private readonly cryptoService: CryptoService,
  ) { }

  async create(data: DeepPartial<User>): Promise<User> {
    const user = this.repo.create(data);
    if (user.password) user.password = await this.cryptoService.encrypt(user.password);
    return this.repo.save(user);
  }

  async update({ id, data }: { id: number; data: DeepPartial<User> }): Promise<User> {
    const user = await this.findOneBy({ filters: { id }, relations: { photo: true } });
    Object.entries(data).forEach(([key, value]) => { if (value !== undefined && key !== 'id') user[key] = value });
    if (data.password) user.password = await this.cryptoService.encrypt(data.password);
    if (data.photo?.id && user.photo?.id && data.photo.id !== user.photo.id) await this.upload.deleteFile(user.photo.id)
    return this.repo.save(user);
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOneBy({ filters: { id } });
    await this.repo.remove(user);
    return user;
  }

  async softDelete(id: number): Promise<User> {
    await this.repo.softDelete(id);
    return await this.repo.findOneOrFail({ where: { id }, withDeleted: true });
  }

  async softRestore(id: number): Promise<User> {
    const result = await this.repo.restore(id);
    if (!result.affected) throw new NotFoundException(`User ${id} no existe`);
    return await this.repo.findOneByOrFail({ id });
  }

  async findOneBy(params: {
    filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    relations?: FindOptionsRelations<User>;
  }): Promise<User> {
    const user = await this.repo.findOne({
      where: params.filters,
      relations: params.relations,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findBy(params: {
    order?: FindOptionsOrder<User>;
    filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];
    relations?: FindOptionsRelations<User>;
    page: number;
    size: number;
    withDeleted?: boolean;
  }): Promise<PaginationParser<User>> {
    const result = await paginate<User>(
      this.repo,
      { page: params.page, limit: params.size },
      { where: params.filters, relations: params.relations, order: params.order, withDeleted: params.withDeleted },
    );
    return new PaginationParser(result)
  }

  async count(
    filters?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<number> {
    return this.repo.count({ where: filters });
  }
}
