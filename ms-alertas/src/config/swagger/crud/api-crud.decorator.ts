import { Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyMethodDoc } from '../helper/apply-method-doc.helper';
import { SwaggerIdType } from '../helper/swagger-id.helper';
import {
  ApiGetListDoc,
  ApiGetByIdDoc,
  ApiPostDoc,
  ApiPatchDoc,
  ApiPutDoc,
  ApiDeleteDoc,
} from '../methods';

export interface ApiCrudDocOptions {
  tag?: string;
  auth?: boolean;
  createDto?: Type<unknown>;
  updateDto?: Type<unknown>;
  responseDto?: Type<unknown>;
  idType?: SwaggerIdType;
  list?: boolean;
  getById?: boolean;
  create?: boolean;
  update?: boolean;
  replace?: boolean;
  delete?: boolean;
}

export const ApiCrudDoc = (options: ApiCrudDocOptions = {}): ClassDecorator => {
  return (target) => {
    const {
      tag,
      auth = false,
      createDto,
      updateDto,
      responseDto,
      idType = 'uuid',
      list = true,
      getById = true,
      create = true,
      update = true,
      replace = true,
      delete: remove = true,
    } = options;

    if (tag) {
      ApiTags(tag)(target);
    }

    if (auth) {
      ApiUnauthorizedResponse({
        description: 'No autorizado',
      })(target);
      ApiForbiddenResponse({
        description: 'No tiene permisos suficientes',
      })(target);
    }

    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
    })(target);

    const models = [createDto, updateDto, responseDto].filter(
      Boolean,
    ) as Type<unknown>[];

    if (models.length > 0) {
      ApiExtraModels(...models)(target);
    }

    const doc = (methodName: string, decorator: MethodDecorator): void =>
      applyMethodDoc(target.prototype, methodName, decorator);

    if (list && responseDto) {
      doc('findAll', ApiGetListDoc(responseDto, { paginated: false }));
    }

    if (getById && responseDto) {
      doc('findOne', ApiGetByIdDoc(responseDto, { idType }));
    }

    if (create && createDto) {
      doc('create', ApiPostDoc(createDto, responseDto));
    }

    if (update && updateDto) {
      doc('update', ApiPatchDoc(updateDto, responseDto, { idType }));
    }

    if (replace && updateDto) {
      doc('replace', ApiPutDoc(updateDto, responseDto, { idType }));
    }

    if (remove) {
      doc('delete', ApiDeleteDoc({ idType }));
    }
  };
};
