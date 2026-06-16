import {
  formatEventDate,
  formatEventDay,
  formatEventDayLabel,
  formatEventTime,
  formatPayloadJson,
  getEventDayKey,
  getEventLogLabel,
  getEventTypeCode,
  getPayloadPreview,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  parseEventDate,
  shortenId,
} from '@/features/events/components/event-utils';

import { AlertNotification } from '../alert-notification.types';
import { Alert } from '../alert.types';

export {
  formatEventDate as formatAlertDate,
  formatEventDay as formatAlertDay,
  formatEventDayLabel as formatAlertDayLabel,
  formatEventTime as formatAlertTime,
  formatPayloadJson,
  getEventDayKey as getAlertDayKey,
  getPayloadPreview,
  getRelativeTime,
  getSeverityAccentClass,
  getSeverityBadgeVariant,
  parseEventDate,
  shortenId,
};

export const ALERT_LOG_GRID =
  'grid-cols-[4.25rem_4.75rem_minmax(0,1fr)_3.25rem_2.25rem_2.75rem]';

export const NOTIFICATION_LOG_GRID =
  'grid-cols-[4.25rem_4.75rem_minmax(0,1fr)_2.25rem_2.75rem]';

export type AlertAttentionFilter = 'all' | 'pending' | 'attended';

export interface AlertFilters {
  search: string;
  status: string;
  attention: AlertAttentionFilter;
}

export function getAlertTitle(alert: Alert) {
  return alert.title?.trim() || getAlertEventLabel(alert);
}

export function getAlertReference(alert: Alert) {
  if (alert.reference?.trim()) {
    return alert.reference.trim();
  }

  return undefined;
}

export function getAlertClientSystemCode(alert: Alert) {
  return alert.event?.clientSystem?.code ?? alert.event?.clientSystem?.name ?? '—';
}

export function isAlertAttended(alert: Alert) {
  if (alert.attendedAt) return true;

  const status = alert.status?.toUpperCase() ?? '';

  return status !== 'OPEN';
}

export function formatNotificationStats(alert: Alert) {
  const stats = alert.notifications ?? {
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
  };

  if (!stats || stats.total === 0) {
    return '0 ent.';
  }

  if (stats.failed > 0) {
    return `${stats.sent}/${stats.total} · ${stats.failed} err`;
  }

  if (stats.pending > 0) {
    return `${stats.sent}/${stats.total} · ${stats.pending} pend`;
  }

  return `${stats.sent}/${stats.total}`;
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
      text: 'text-destructive',
    };
  }

  if (normalized === 'RESOLVED') {
    return {
      badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
    };
  }

  if (normalized === 'NOTIFIED') {
    return {
      badge: 'bg-sky-500/15 text-sky-800 border-sky-500/30 dark:text-sky-400',
      dot: 'bg-sky-500',
      text: 'text-sky-700 dark:text-sky-400',
    };
  }

  if (normalized === 'OPEN') {
    return {
      badge: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-400',
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
    };
  }

  return {
    badge: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
  };
}

export function getNotificationStatusTone(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === 'FAILED') {
    return {
      badge: 'bg-destructive/15 text-destructive border-destructive/30',
      dot: 'bg-destructive',
      text: 'text-destructive',
    };
  }

  if (normalized === 'SENT') {
    return {
      badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
    };
  }

  if (normalized === 'PROCESSING') {
    return {
      badge: 'bg-primary/15 text-primary border-primary/30',
      dot: 'bg-primary',
      text: 'text-primary',
    };
  }

  if (normalized === 'PENDING') {
    return {
      badge: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-400',
      dot: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
    };
  }

  return {
    badge: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
  };
}

export function getAlertClientSystemName(alert: Alert) {
  return alert.event?.clientSystem?.name ?? '—';
}

export function getAlertEventCode(alert: Alert) {
  if (!alert.event) return '—';

  return getEventTypeCode(alert.event);
}

export function getAlertEventLabel(alert: Alert) {
  if (!alert.event) return '—';

  return getEventLogLabel(alert.event);
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
      getAlertTitle(alert).toLowerCase().includes(search)
      || alert.message.toLowerCase().includes(search)
      || getAlertReference(alert)?.toLowerCase().includes(search)
      || getAlertEventCode(alert).toLowerCase().includes(search)
      || getAlertClientSystemName(alert).toLowerCase().includes(search)
      || getAlertClientSystemCode(alert).toLowerCase().includes(search)
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
