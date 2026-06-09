import {
  formatEventDate,
  formatEventDay,
  formatEventTime,
  formatPayloadJson,
  getPayloadPreview,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  parseEventDate,
} from '@/features/events/components/event-utils';

import { AlertNotification } from '../alert-notification.types';
import { Alert } from '../alert.types';

export {
  formatEventDate as formatAlertDate,
  formatEventDay as formatAlertDay,
  formatEventTime as formatAlertTime,
  formatPayloadJson,
  getPayloadPreview,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  parseEventDate,
};

export type AlertAttentionFilter = 'all' | 'pending' | 'attended';

export interface AlertFilters {
  search: string;
  status: string;
  attention: AlertAttentionFilter;
}

export function isAlertAttended(alert: Alert) {
  return Boolean(alert.attendedAt);
}

export function sortAlertsByDateDesc(alerts: Alert[]) {
  return [...alerts].sort((a, b) => {
    const dateA = parseEventDate(a.alertDate)?.getTime() ?? 0;
    const dateB = parseEventDate(b.alertDate)?.getTime() ?? 0;

    return dateB - dateA;
  });
}

export function groupAlertsByStatus(alerts: Alert[]) {
  const groups = new Map<string, Alert[]>();

  for (const alert of alerts) {
    const key = alert.status?.trim() || 'SIN_ESTADO';
    const list = groups.get(key) ?? [];
    list.push(alert);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .map(([status, items]) => ({
      status,
      items: sortAlertsByDateDesc(items),
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getAlertStatusTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'FAILED') {
    return {
      badge: 'bg-destructive/15 text-destructive border-destructive/30',
      dot: 'bg-destructive',
    };
  }

  if (normalized === 'RESOLVED') {
    return {
      badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    };
  }

  if (normalized === 'NOTIFIED') {
    return {
      badge: 'bg-sky-500/15 text-sky-800 border-sky-500/30 dark:text-sky-400',
      dot: 'bg-sky-500',
    };
  }

  if (normalized === 'OPEN') {
    return {
      badge: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-400',
      dot: 'bg-amber-500',
    };
  }

  return {
    badge: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  };
}

export function getNotificationStatusTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'FAILED') {
    return {
      badge: 'bg-destructive/15 text-destructive border-destructive/30',
      dot: 'bg-destructive',
    };
  }

  if (normalized === 'SENT') {
    return {
      badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    };
  }

  if (normalized === 'PROCESSING') {
    return {
      badge: 'bg-primary/15 text-primary border-primary/30',
      dot: 'bg-primary',
    };
  }

  if (normalized === 'PENDING') {
    return {
      badge: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-400',
      dot: 'bg-amber-500',
    };
  }

  return {
    badge: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  };
}

export function getAlertClientSystemName(alert: Alert) {
  return alert.event?.clientSystem?.name ?? '—';
}

export function getAlertEventCode(alert: Alert) {
  return alert.event?.code ?? '—';
}

export function getNotificationResponse(
  notification: AlertNotification,
): Record<string, unknown> | undefined {
  return notification.responseJson ?? notification.response_json;
}

export function getNotificationPayload(
  notification: AlertNotification,
): Record<string, unknown> | undefined {
  return notification.payloadJson ?? notification.payload_json;
}

export function getNotificationErrorMessage(notification: AlertNotification) {
  return notification.errorMessage ?? notification.error_message;
}

export function filterAlerts(alerts: Alert[], filters: AlertFilters) {
  const search = filters.search.trim().toLowerCase();

  return alerts.filter((alert) => {
    if (filters.status !== 'all' && alert.status !== filters.status) {
      return false;
    }

    if (filters.attention === 'pending' && isAlertAttended(alert)) {
      return false;
    }

    if (filters.attention === 'attended' && !isAlertAttended(alert)) {
      return false;
    }

    if (!search) return true;

    return (
      alert.title.toLowerCase().includes(search)
      || alert.message.toLowerCase().includes(search)
      || getAlertEventCode(alert).toLowerCase().includes(search)
      || getAlertClientSystemName(alert).toLowerCase().includes(search)
      || alert.severityLevel?.name?.toLowerCase().includes(search)
      || alert.alertRule?.name?.toLowerCase().includes(search)
    );
  });
}

export function groupNotificationsByStatus(notifications: AlertNotification[]) {
  const groups = new Map<string, AlertNotification[]>();

  for (const notification of notifications) {
    const key = notification.status?.trim() || 'SIN_ESTADO';
    const list = groups.get(key) ?? [];
    list.push(notification);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .map(([status, items]) => ({ status, count: items.length }))
    .sort((a, b) => b.count - a.count);
}

export interface NotificationFilters {
  search: string;
  status: string;
}

export function filterNotifications(
  notifications: AlertNotification[],
  filters: NotificationFilters,
) {
  const search = filters.search.trim().toLowerCase();

  return notifications.filter((notification) => {
    if (filters.status !== 'all' && notification.status !== filters.status) {
      return false;
    }

    if (!search) return true;

    const payload = formatPayloadJson(getNotificationPayload(notification), 0).toLowerCase();

    return (
      notification.title.toLowerCase().includes(search)
      || notification.message.toLowerCase().includes(search)
      || notification.target.toLowerCase().includes(search)
      || notification.notificationChannel?.name?.toLowerCase().includes(search)
      || notification.alert?.title?.toLowerCase().includes(search)
      || payload.includes(search)
    );
  });
}

export function sortNotificationsBySentAt(notifications: AlertNotification[]) {
  return [...notifications].sort((a, b) => {
    const dateA = parseEventDate(a.sentAt)?.getTime() ?? 0;
    const dateB = parseEventDate(b.sentAt)?.getTime() ?? 0;

    return dateB - dateA;
  });
}
