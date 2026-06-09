'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { clientSystemTokenService } from '../../services/client-system-token.service';

export function useClientSystemTokensByClientSystem(
  clientSystemId?: string,
) {
  return useQuery({
    queryKey: [
      QUERY_KEYS.clientSystemTokens,
      'client-system',
      clientSystemId,
    ],
    queryFn: () =>
      clientSystemTokenService.findByClientSystemId(
        clientSystemId!,
      ),
    enabled: !!clientSystemId,
  });
}