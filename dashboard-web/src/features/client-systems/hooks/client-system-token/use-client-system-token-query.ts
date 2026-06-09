"use client";

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { clientSystemTokenService } from '../../services/client-system-token.service';
import { ClientSystemToken } from '../../types/client-system-token.types';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';

export function useClientSystemTokenQuery() {
    return useBaseEntityQuery<ClientSystemToken>(clientSystemTokenService, {
        queryKey: QUERY_KEYS.clientSystemTokens,
    });
}
