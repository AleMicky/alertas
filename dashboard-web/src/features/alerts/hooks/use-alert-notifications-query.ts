'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';

import { alertNotificationService } from '../alert-notification.service';
import { AlertNotification } from '../alert-notification.types';

export function useAlertNotificationsQuery() {
  return useBaseEntityQuery<AlertNotification>(alertNotificationService, {
    queryKey: QUERY_KEYS.alertNotifications,
  });
}

export function useAlertNotificationsByAlert(alertId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.alertNotifications, 'by-alert', alertId],
    queryFn: () => alertNotificationService.getByAlertId(alertId!),
    enabled: Boolean(alertId),
  });
}
