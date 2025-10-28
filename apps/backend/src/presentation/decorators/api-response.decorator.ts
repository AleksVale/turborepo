import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseDto } from '../dtos/success-response.dto';

export function ApiOkResponseDecorator<DataDto extends Type<unknown>>(
  dataDto: DataDto | null
): MethodDecorator;

export function ApiOkResponseDecorator<DataDto extends Type<unknown>>(
  dataDtos: DataDto[] | null
): MethodDecorator;

export function ApiOkResponseDecorator<DataDto extends Type<unknown>>(
  dataDtoOrDtos: DataDto | DataDto[] | null
): MethodDecorator {
  if (dataDtoOrDtos === null) {
    return applyDecorators(
      ApiExtraModels(SuccessResponseDto),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessResponseDto) },
            {
              properties: {
                registers: {
                  type: 'null',
                  nullable: true,
                },
              },
            },
          ],
        },
      })
    );
  }

  if (Array.isArray(dataDtoOrDtos)) {
    return applyDecorators(
      ApiExtraModels(SuccessResponseDto, ...dataDtoOrDtos),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessResponseDto) },
            {
              properties: {
                registers: {
                  oneOf: dataDtoOrDtos.map((dto) => ({
                    $ref: getSchemaPath(dto),
                  })),
                },
              },
            },
          ],
        },
      })
    );
  }

  return applyDecorators(
    ApiExtraModels(SuccessResponseDto, dataDtoOrDtos),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              registers: {
                $ref: getSchemaPath(dataDtoOrDtos),
              },
            },
          },
        ],
      },
    })
  );
}
