import { PartialType } from '@nestjs/swagger';
import { CreateSeverityLevelDto } from './create-severity-level.dto';

export class UpdateSeverityLevelDto extends PartialType(
  CreateSeverityLevelDto,
) {}
