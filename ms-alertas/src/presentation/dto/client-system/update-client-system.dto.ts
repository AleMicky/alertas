import { PartialType } from '@nestjs/swagger';
import { CreateClientSystemDto } from './create-client-system.dto';

export class UpdateClientSystemDto extends PartialType(CreateClientSystemDto) {}
