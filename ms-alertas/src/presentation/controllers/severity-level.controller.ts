import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { SeverityLevel } from 'src/domain/entities/severity-level';
import { SeverityLevelService } from 'src/app/services/severity-level.service';
import { SeverityLevelResponseSchema } from '../schemas';
import {
  CreateSeverityLevelDto,
  UpdateSeverityLevelDto,
} from '../dto/severity-level';

@Controller('severity-levels')
@ApiCrudDoc({
  tag: 'Niveles de severidad',
  createDto: CreateSeverityLevelDto,
  updateDto: UpdateSeverityLevelDto,
  responseDto: SeverityLevelResponseSchema,
})
export class SeverityLevelController extends BaseController<
  SeverityLevel,
  CreateSeverityLevelDto,
  UpdateSeverityLevelDto
> {
  constructor(private readonly severityLevelService: SeverityLevelService) {
    super(severityLevelService);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Obtener nivel de severidad por código' })
  @ApiParam({
    name: 'code',
    example: 'HIGH',
    description: 'Código del nivel de severidad',
  })
  @ApiOkResponse({
    description: 'Nivel de severidad encontrado',
    type: SeverityLevelResponseSchema,
  })
  findByCode(@Param('code') code: string) {
    return this.severityLevelService.findByCode(code);
  }
}
