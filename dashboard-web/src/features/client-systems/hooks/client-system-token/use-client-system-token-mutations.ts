'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { ClientSystemToken } from '../../types/client-system-token.types';
import { CreateClientSystemTokenDto, UpdateClientSystemTokenDto } from '../../schemas/client-system-token.schema';
import { clientSystemTokenService } from '../../services/client-system-token.service';


export function useClientSystemTokenMutations() {
    return useBaseEntityMutations<
        ClientSystemToken,
        CreateClientSystemTokenDto,
        UpdateClientSystemTokenDto
    >(clientSystemTokenService, {
        queryKey: QUERY_KEYS.clientSystemTokens,
        entityName: 'Token de sistema cliente',
    });
}