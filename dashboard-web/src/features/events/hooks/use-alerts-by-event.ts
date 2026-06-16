'use client';

import { useQuery } from '@tanstack/react-query';

import { alertService } from '@/features/alerts/alert.service';
import { QUERY_KEYS } from '@/shared/constants/query-keys';

export function useAlertsByEventId(eventId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.alerts, 'event', eventId],
    queryFn: () => alertService.getByEventId(eventId!),
    enabled: Boolean(eventId),
  });
}
