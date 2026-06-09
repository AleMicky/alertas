import { Controller } from '@nestjs/common';
import { BaseController } from 'src/shared/core/base.controller';
import { ApiCrudDoc } from 'src/config/swagger/crud';
import { ClientSystem } from 'src/domain/entities/client-system';
import { ClientSystemService } from 'src/app/services/client-system.service';
import {
  CreateClientSystemDto,
  UpdateClientSystemDto,
  ResponseClientSystemDto,
} from '../dto/client-system';

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
  constructor(private readonly clientSystemService: ClientSystemService) {
    super(clientSystemService);
  }
}
