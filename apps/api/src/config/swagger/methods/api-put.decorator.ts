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

interface ApiPutDocOptions {
  summary?: string;
  description?: string;
  idType?: 'uuid' | 'string' | 'number';
}

export const ApiPutDoc = (
  updateDto?: Type<unknown>,
  responseDto?: Type<unknown>,
  options: ApiPutDocOptions = {},
) => {
  const {
    summary = 'Reemplazar registro (PUT)',
    description = 'Reemplaza el registro completo por ID',
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
        description: 'Datos del registro a actualizar',
      }),
    );
  }

  if (responseDto) {
    decorators.push(
      ApiOkResponse({
        description: 'Registro actualizado correctamente',
        type: responseDto,
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        description: 'Registro actualizado correctamente',
      }),
    );
  }

  return applyDecorators(...decorators);
};
