import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Número total de registros', example: 100 })
  total!: number;

  @ApiProperty({ description: 'Número de registros por página', example: 10 })
  perPage!: number;

  @ApiProperty({ description: 'Página atual', example: 1 })
  currentPage!: number;

  @ApiProperty({
    description: 'Próxima página (null se estiver na última página)',
    example: 2,
    nullable: true,
  })
  nextPage!: number | null;

  @ApiProperty({
    description: 'Página anterior (null se estiver na primeira página)',
    example: null,
    nullable: true,
  })
  prevPage!: number | null;

  @ApiProperty({ description: 'Número da última página', example: 10 })
  lastPage!: number;
}

export class PaginatedControllerResponseDto<T> {
  @ApiProperty({ type: PaginationDto })
  paginate!: PaginationDto;

  @ApiProperty({ type: 'array', isArray: true })
  registers!: T[];
}
