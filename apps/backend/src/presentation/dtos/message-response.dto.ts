import { ApiProperty } from '@nestjs/swagger'

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensagem de resposta',
    example: 'Operação concluída com sucesso',
  })
  message: string
}
