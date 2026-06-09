import { PartialType } from '@nestjs/swagger';
import { CreateClientSystemTokenDto } from './create-client-system-token.dto';

export class UpdateClientSystemTokenDto extends PartialType(
  CreateClientSystemTokenDto,
) {}
