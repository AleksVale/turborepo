import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedSuccessResponseDto } from '../dtos/paginated-success-response.dto';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto
) =>
  applyDecorators(
    ApiExtraModels(PaginatedSuccessResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedSuccessResponseDto) },
          {
            properties: {
              message: {
                type: 'string',
              },
              registers: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    })
  );
