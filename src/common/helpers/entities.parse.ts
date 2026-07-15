import { FindOperator, FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof FindOperator) &&
    value.constructor === Object
  );
}

function buildNested(path: string, value: unknown): Record<string, unknown> {
  return path
    .split('.')
    .reduceRight<unknown>((acc, key) => ({ [key]: acc }), value) as Record<string, unknown>;
}

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = out[key];
    out[key] = isPlainObject(existing) && isPlainObject(value) ? deepMerge(existing, value) : value;
  }
  return out;
}

export function parseSearch<TEntity>(
  search: string | undefined,
  fields: string[],
  baseFilter: FindOptionsWhere<TEntity> = {},
): FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] {
  if (!search?.trim()) return baseFilter;

  const matcher = ILike(`%${search.trim()}%`);

  return fields.map(
    (field) =>
      deepMerge(baseFilter as Record<string, unknown>, buildNested(field, matcher)) as FindOptionsWhere<TEntity>,
  );
}

const DEFAULT_SORT = { id: 'ASC' } as FindOptionsOrder<unknown>;

export function parseSort<T>(sortParam: string | undefined, allowedFields?: (keyof T)[]): FindOptionsOrder<T> {
  if (!sortParam) return DEFAULT_SORT;

  const order = sortParam.split(',').reduce((acc, part) => {

    const [field, dir = 'ASC'] = part.trim().split(':');
    const direction = dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    if (allowedFields && !allowedFields.includes(field as keyof T)) return acc

    return { ...acc, [field]: direction };
  }, {} as FindOptionsOrder<T>);

  return Object.keys(order).length ? order : (DEFAULT_SORT);
}
