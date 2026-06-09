import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export interface ApiGetListDocOptions {
  summary?: string;
  description?: string;
  paginated?: boolean;
  withFilter?: boolean;
}

export const ApiGetListDoc = (
  responseDto?: Type<unknown>,
  options: ApiGetListDocOptions = {},
) => {
  const {
    summary = 'Obtener lista de registros',
    description = 'Lista de registros obtenida correctamente',
    paginated = false,
    withFilter = false,
  } = options;

  const decorators = [
    ...(responseDto ? [ApiExtraModels(responseDto)] : []),

    ApiOperation({
      summary,
      description,
    }),

    ...(paginated
      ? [
          ApiQuery({
            name: 'page',
            required: false,
            example: 1,
            description: 'Número de página',
          }),
          ApiQuery({
            name: 'size',
            required: false,
            example: 10,
            description: 'Cantidad de registros por página',
          }),
        ]
      : []),

    ApiUnauthorizedResponse({
      description: 'No autorizado',
    }),

    ApiBadRequestResponse({
      description: 'Parámetros inválidos',
    }),

    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    }),

    ApiOkResponse(
      responseDto
        ? {
            description,
            schema: paginated
              ? {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(responseDto) },
                    },
                    total: { type: 'number', example: 100 },
                  },
                }
              : {
                  type: 'array',
                  items: { $ref: getSchemaPath(responseDto) },
                },
          }
        : { description },
    ),
  ];

  if (withFilter) {
    decorators.push(
      ApiQuery({
        name: 'filter',
        required: false,
        example: 'texto de búsqueda',
        description: 'Texto para filtrar registros',
      }),
    );
  }

  return applyDecorators(...decorators);
};
