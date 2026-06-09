import { SeverityLevel } from './severity-level.types';
import {
  CreateSeverityLevelDto,
  UpdateSeverityLevelDto
} from './severity-level.schema';
import { baseService } from '@/shared/core/base.service';


const endpoint = '/severity-levels';

export const severityLevelService =
  baseService<
    SeverityLevel,
    CreateSeverityLevelDto,
    UpdateSeverityLevelDto
  >(endpoint);