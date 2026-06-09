import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { getSwaggerIdConfig } from '../helper/swagger-id.helper';

export interface ApiPatchDocOptions {
  summary?: string;
  description?: string;
  idType?: 'uuid' | 'number' | 'string';
}

export const ApiPatchDoc = (
  updateDto?: Type<unknown>,
  responseDto?: Type<unknown>,
  options: ApiPatchDocOptions = {},
) => {
  const {
    summary = 'Actualizar parcialmente (PATCH)',
    description = 'Actualiza solo los campos enviados en el body',
    idType = 'string',
  } = options;

  const idConfig = getSwaggerIdConfig(idType);

  const decorators = [
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
      description: 'Datos inválidos enviados en la solicitud',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    }),
  ];

  if (updateDto) {
    decorators.push(
      ApiBody({
        type: updateDto,
        required: true,
      }),
    );
  }

  if (responseDto) {
    decorators.push(
      ApiOkResponse({
        description,
        type: responseDto,
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        description,
      }),
    );
  }

  return applyDecorators(...decorators);
};
