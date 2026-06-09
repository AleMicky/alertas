'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';

import { clientSystemService } from '../../services/client-system.service';
import { ClientSystem } from '../../types/client-system.types';
import {
    CreateClientSystemDto,
    UpdateClientSystemDto,
} from '../../schemas/client-system.schema';


export function useClientSystemsMutations() {
    return useBaseEntityMutations<
        ClientSystem,
        CreateClientSystemDto,
        UpdateClientSystemDto
    >(clientSystemService, {
        queryKey: QUERY_KEYS.clientSystems,
        entityName: 'Sistema cliente',
    });
}