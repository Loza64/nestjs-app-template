import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { PaginationParse } from '../parser/pagination.parse';

export interface ICrudService<T extends ObjectLiteral> {
  create(data: DeepPartial<T>): Promise<T>;
  update(params: { id: number; data: DeepPartial<T> }): Promise<T>;
  delete(id: number): Promise<T>;
  findOneBy(params: { filters: FindOptionsWhere<T> | FindOptionsWhere<T>[]; relations?: FindOptionsRelations<T>; }): Promise<T>;
  findBy(params: {
    filters: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: FindOptionsRelations<T>;
    page: number;
    size: number;
  }): Promise<PaginationParse<T>>;
  count(filters?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<number>;
}
