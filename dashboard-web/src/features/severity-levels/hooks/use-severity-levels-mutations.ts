'use client';

import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { severityLevelService } from '../severity-level.service';
import { SeverityLevel } from '../severity-level.types';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { CreateSeverityLevelDto, UpdateSeverityLevelDto } from '../severity-level.schema';

export function useSeverityLevelsMutations() {
    return useBaseEntityMutations<
        SeverityLevel,
        CreateSeverityLevelDto,
        UpdateSeverityLevelDto
    >(severityLevelService, {
        queryKey: QUERY_KEYS.severityLevels,
        entityName: 'Severidad',
    });
}