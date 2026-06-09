import { applyDecorators, Type } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { getSwaggerIdConfig } from '../helper/swagger-id.helper';

export interface ApiGetByIdDocOptions {
  summary?: string;
  description?: string;
  idType?: 'uuid' | 'number' | 'string';
}

export const ApiGetByIdDoc = (
  responseDto: Type<unknown>,
  options: ApiGetByIdDocOptions = {},
) => {
  const {
    summary = 'Obtener registro por ID',
    description = 'Registro obtenido correctamente',
    idType = 'string',
  } = options;

  const idConfig = getSwaggerIdConfig(idType);

  return applyDecorators(
    ApiOperation({
      summary,
      description,
    }),
    ApiParam({
      name: 'id',
      required: true,
      example: idConfig.example,
      description: `Identificador tipo ${idType}`,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado',
    }),
    ApiNotFoundResponse({
      description: 'Registro no encontrado',
    }),
    ApiBadRequestResponse({
      description: 'Parámetros inválidos',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    }),
    ApiOkResponse({
      description,
      type: responseDto,
    }),
  );
};
