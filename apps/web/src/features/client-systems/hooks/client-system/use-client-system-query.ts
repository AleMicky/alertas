'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';

import { clientSystemService } from '../../services/client-system.service';
import { ClientSystem } from '../../types/client-system.types';

export function useClientSystemsQuery() {
    return useBaseEntityQuery<ClientSystem>(clientSystemService, {
        queryKey: QUERY_KEYS.clientSystems,
    });
}

