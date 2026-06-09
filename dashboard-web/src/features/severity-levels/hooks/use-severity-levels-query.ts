'use client';

import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';
import { severityLevelService } from '../severity-level.service';
import { SeverityLevel } from '../severity-level.types';
import { QUERY_KEYS } from '@/shared/constants/query-keys';

export function useSeverityLevelsQuery() {
    return useBaseEntityQuery<SeverityLevel>(
        severityLevelService,
        {
            queryKey: QUERY_KEYS.severityLevels,
        },
    );
}