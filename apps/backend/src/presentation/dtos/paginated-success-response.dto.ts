import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
  @ApiProperty({
    description: 'Número total de registros',
    example: 100,
  })
  total: number

  @ApiProperty({
    description: 'Número de registros por página',
    example: 10,
  })
  perPage: number

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  currentPage: number

  @ApiProperty({
    description: 'Próxima página (null se estiver na última página)',
    example: 2,
    nullable: true,
  })
  nextPage: number | null

  @ApiProperty({
    description: 'Página anterior (null se estiver na primeira página)',
    example: null,
    nullable: true,
  })
  prevPage: number | null

  @ApiProperty({
    description: 'Número da última página',
    example: 10,
  })
  lastPage: number

  constructor(partial: Partial<PaginationDto>) {
    Object.assign(this, partial)
  }
}

export class PaginatedSuccessResponseDto<T> {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: '200',
  })
  code: string

  @ApiProperty({
    description: 'Mensagem de retorno da requisição',
    example: 'Requisição processada com sucesso!',
  })
  message: string

  @ApiProperty({
    description: 'Nome do serviço que processou a requisição',
    example: 'EquipmentService',
  })
  service: string

  @ApiProperty({
    description: 'Data e hora do processamento da requisição',
    example: '2023-05-10T15:30:45.123Z',
  })
  eventDate: string

  @ApiProperty({
    type: PaginationDto,
    description: 'Informações de paginação',
  })
  paginate: PaginationDto

  registers: T

  constructor(partial: Partial<PaginatedSuccessResponseDto<T>>) {
    this.code = '200'
    this.message = 'Requisição processada com sucesso!'
    this.eventDate = new Date().toISOString()
    Object.assign(this, partial)
  }
}
