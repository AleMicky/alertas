'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';

import { alertService } from '../alert.service';
import { Alert } from '../alert.types';

export function useAlertQuery() {
  return useBaseEntityQuery<Alert>(alertService, {
    queryKey: QUERY_KEYS.alerts,
  });
}
