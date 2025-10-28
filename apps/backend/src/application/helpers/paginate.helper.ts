import { PaginationDto } from '../../presentation/dtos/paginated-controller-response.dto';

export function buildPaginate({
  total,
  page,
  limit,
}: {
  total: number;
  page: number;
  limit: number;
}): PaginationDto {
  const lastPage = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    perPage: limit,
    currentPage: page,
    nextPage: page < lastPage ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    lastPage,
  };
}
