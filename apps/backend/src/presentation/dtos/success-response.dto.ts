import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({
    description: 'HTTP response code',
    example: '200',
    default: '200',
  })
  code: string;

  @ApiProperty({
    description: 'Descriptive message of the operation result',
    example: 'Request processed successfully!',
    default: 'Requisição processada com sucesso!',
  })
  message: string;

  @ApiProperty({
    description: 'Name of the service that processed the request',
    example: 'auth-service',
  })
  service!: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-03-20T15:30:45.123Z',
  })
  eventDate: string;

  registers!: T;

  constructor(partial: Partial<SuccessResponseDto<T>>) {
    this.code = '200';
    this.eventDate = new Date().toISOString();
    Object.assign(this, partial);
    this.message = partial.message ?? 'Requisição processada com sucesso!';
  }
}
