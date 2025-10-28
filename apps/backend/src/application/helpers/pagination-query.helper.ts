export interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
}

export function createPaginationQuery(params: {
  page?: number;
  limit?: number;
}): PaginationQuery {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
