import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface ApiPostDocOptions {
  summary?: string;
  description?: string;
}

export const ApiPostDoc = (
  createDto?: Type<unknown>,
  responseDto?: Type<unknown>,
  options: ApiPostDocOptions = {},
) => {
  const {
    summary = 'Crear registro',
    description = 'Crear un nuevo registro',
  } = options;

  const decorators = [
    ApiOperation({
      summary,
      description,
    }),
    ApiBadRequestResponse({
      description: 'Datos inválidos enviados en la solicitud',
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado',
    }),
    ApiConflictResponse({
      description: 'El registro ya existe',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    }),
  ];

  if (createDto) {
    decorators.push(
      ApiBody({
        type: createDto,
        description: 'Datos del registro a crear',
      }),
    );
  }

  if (responseDto) {
    decorators.push(
      ApiCreatedResponse({
        description: 'Registro creado correctamente',
        type: responseDto,
      }),
    );
  } else {
    decorators.push(
      ApiCreatedResponse({
        description: 'Registro creado correctamente',
      }),
    );
  }

  return applyDecorators(...decorators);
};
