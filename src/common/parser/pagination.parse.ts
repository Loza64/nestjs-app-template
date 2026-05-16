import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate'

export class PaginationParse<T> {
  readonly data: T[]
  readonly page: number
  readonly pageSize: number
  readonly pageCount: number
  readonly total: number

  constructor(pagination: Pagination<T, IPaginationMeta>) {
    const { items, meta } = pagination
    this.data = items
    this.page = meta.currentPage
    this.pageSize = meta.itemsPerPage
    this.pageCount = meta.totalPages ?? 0
    this.total = meta.totalItems ?? 0
  }
}
