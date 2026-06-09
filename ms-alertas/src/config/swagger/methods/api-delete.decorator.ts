import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { getSwaggerIdConfig } from '../helper/swagger-id.helper';
interface ApiDeleteDocOptions {
  idType?: 'string' | 'number' | 'uuid';
}

export const ApiDeleteDoc = (options: ApiDeleteDocOptions = {}) => {
  const { idType = 'string' } = options;

  const idConfig = getSwaggerIdConfig(idType);

  return applyDecorators(
    ApiOperation({ summary: 'Eliminar registro' }),
    ApiParam({
      name: 'id',
      required: true,
      example: idConfig.example,
      description: `ID del registro a eliminar. Tipo: ${idType}`,
    }),
    ApiOkResponse({
      description: 'Registro eliminado correctamente',
    }),
    ApiNotFoundResponse({
      description: 'Registro no encontrado',
    }),
    ApiBadRequestResponse({
      description: 'Error al eliminar el registro',
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    }),
  );
};
