import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { PaginationParser } from '../parser/pagination.parser';

export interface ICrudService<T extends ObjectLiteral> {
  create(data: DeepPartial<T>): Promise<T>;
  update(params: { id: number; data: DeepPartial<T> }): Promise<T>;
  delete(id: number): Promise<T>;
  softDelete(id: number): Promise<T>;
  softRestore(id: number): Promise<T>;
  findOneBy(params: { filters: FindOptionsWhere<T> | FindOptionsWhere<T>[]; relations?: FindOptionsRelations<T>; }): Promise<T>;
  findBy(params: {
    order?: FindOptionsOrder<T>;
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: FindOptionsRelations<T>;
    page: number;
    size: number;
    withDeleted?: boolean;
  }): Promise<PaginationParser<T>>;
  count(filters?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number>;
}
