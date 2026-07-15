import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { ClientSystem } from 'src/domain/entities/client-system';
import { RoleCode } from 'src/domain/enums';
import { ClientSystemService } from 'src/app/services/client-system.service';
import { Roles } from 'src/infrastructure/security';
import {
  CreateClientSystemDto,
  UpdateClientSystemDto,
  ResponseClientSystemDto,
} from '../dto/client-system';
import { ClientSystemTokenService } from 'src/app/services/client-system-token.service';
import { CreateClientSystemTokenDto } from '../dto/client-system-token/create-client-system-token.dto';

@ApiBearerAuth('jwt')
@Roles(RoleCode.ADMIN, RoleCode.OPERADOR)
@Controller('client-systems')
@ApiCrudDoc({
  tag: 'Sistemas cliente',
  createDto: CreateClientSystemDto,
  updateDto: UpdateClientSystemDto,
  responseDto: ResponseClientSystemDto,
})
export class ClientSystemController extends BaseController<
  ClientSystem,
  CreateClientSystemDto,
  UpdateClientSystemDto
> {
  constructor(
    private readonly clientSystemService: ClientSystemService,
    private readonly clientSystemTokenService: ClientSystemTokenService,
  ) {
    super(clientSystemService);
  }

  @Get(':clientSystemId/tokens')
  findByClientSystemId(@Param('clientSystemId') clientSystemId: string) {
    return this.clientSystemTokenService.findByClientSystemId(clientSystemId);
  }

  @Post(':clientSystemId/generate-token')
  createToken(@Param('clientSystemId') clientSystemId: string, @Body() dto: CreateClientSystemTokenDto) {
    return this.clientSystemTokenService.createToken(clientSystemId, dto);
  }
  
  @Delete(':tokenId/revoke')
  revokeToken(@Param('tokenId') tokenId: string) {
    return this.clientSystemTokenService.revokeToken(tokenId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientSystemService.deleteFromToken(id);
  }
}
