import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';

import { ClientSystemToken } from 'src/domain/entities/client-system-token';
import { ClientSystemTokenService } from 'src/app/services/client-system-token.service';

import { ClientSystemTokenResponseSchema } from '../schemas';

import {
  CreateClientSystemTokenDto,
  UpdateClientSystemTokenDto,
} from '../dto/client-system-token';

@Controller('client-system-tokens')
@ApiCrudDoc({
  tag: 'Tokens',
  createDto: CreateClientSystemTokenDto,
  updateDto: UpdateClientSystemTokenDto,
  responseDto: ClientSystemTokenResponseSchema,
})
export class ClientSystemTokenController extends BaseController<
  ClientSystemToken,
  CreateClientSystemTokenDto,
  UpdateClientSystemTokenDto
> {
  constructor(
    private readonly clientSystemTokenService: ClientSystemTokenService,
  ) {
    super(clientSystemTokenService);
  }

  @Get('client-system/:clientSystemId')
  @ApiOperation({ summary: 'Listar tokens por sistema cliente' })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: [ClientSystemTokenResponseSchema] })
  findByClientSystemId(@Param('clientSystemId') clientSystemId: string) {
    return this.clientSystemTokenService.findByClientSystemId(clientSystemId);
  }

  @Post('client-system/:clientSystemId/generate')
  @ApiOperation({
    summary: 'Generar token para sistema cliente',
    description:
      'El token se muestra una sola vez. Luego solo se guarda su hash.',
  })
  @ApiParam({
    name: 'clientSystemId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      example: {
        description: 'Token para producción',
        expiresAt: '2026-12-31T23:59:59.000Z',
      },
    },
  })
  createToken(
    @Param('clientSystemId') clientSystemId: string,
    @Body()
    dto: {
      description?: string;
      expiresAt?: string;
    },
  ) {
    return this.clientSystemTokenService.createToken(
      clientSystemId,
      dto.description,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  @Delete(':tokenId/revoke')
  @ApiOperation({ summary: 'Revocar token' })
  @ApiParam({
    name: 'tokenId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  revokeToken(@Param('tokenId') tokenId: string) {
    return this.clientSystemTokenService.revokeToken(tokenId);
  }
}
