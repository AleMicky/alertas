import { Event } from '../event.types';

type EventWithSnakePayload = Event & {
  payload_json?: Record<string, unknown>;
};

export type EventTrackingFilter = 'all' | 'pending' | 'processed';

export function getEventPayload(
  event: EventWithSnakePayload,
): Record<string, unknown> | undefined {
  return event.payloadJson ?? event.payload_json;
}

export function parseEventDate(value: Date | string | undefined): Date | null {
  if (!value) return null;

  const date = typeof value === 'string' ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export function formatEventDate(value: Date | string | undefined) {
  const date = parseEventDate(value);

  if (!date) return '-';

  return date.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatEventTime(value: Date | string | undefined) {
  const date = parseEventDate(value);

  if (!date) return '-';

  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatEventDay(value: Date | string | undefined) {
  const date = parseEventDate(value);

  if (!date) return '-';

  return date.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getRelativeTime(value: Date | string | undefined) {
  const date = parseEventDate(value);

  if (!date) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'Hace un momento';
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);

  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) return `Hace ${diffDays} d`;

  return formatEventDay(value);
}

export function isEventProcessed(event: Event) {
  return Boolean(event.processedAt);
}

export function sortEventsByDateDesc(events: Event[]) {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a.eventDate)?.getTime() ?? 0;
    const dateB = parseEventDate(b.eventDate)?.getTime() ?? 0;

    return dateB - dateA;
  });
}

export function groupEventsByStatus(events: Event[]) {
  const groups = new Map<string, Event[]>();

  for (const event of events) {
    const key = event.status?.trim() || 'SIN_ESTADO';
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .map(([status, items]) => ({
      status,
      items: sortEventsByDateDesc(items),
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getSeverityAccentClass(priority?: number) {
  if (priority === undefined) return 'bg-muted-foreground';
  if (priority >= 3) return 'bg-destructive';
  if (priority >= 2) return 'bg-primary';
  return 'bg-emerald-500';
}

export function getSeverityBadgeVariant(
  priority?: number,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (priority === undefined) return 'secondary';
  if (priority >= 3) return 'destructive';
  if (priority >= 2) return 'default';
  return 'secondary';
}

export function getStatusTone(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes('error')
    || normalized.includes('fail')
    || normalized.includes('rechaz')
  ) {
    return {
      badge: 'bg-destructive/15 text-destructive border-destructive/30',
      dot: 'bg-destructive',
    };
  }

  if (
    normalized.includes('process')
    || normalized.includes('proces')
    || normalized.includes('ok')
    || normalized.includes('complet')
  ) {
    return {
      badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    };
  }

  if (
    normalized.includes('pend')
    || normalized.includes('new')
    || normalized.includes('recib')
  ) {
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

export function formatPayloadJson(
  payload: Record<string, unknown> | undefined,
  indent = 2,
): string {
  if (!payload || Object.keys(payload).length === 0) {
    return '{}';
  }

  try {
    return JSON.stringify(payload, null, indent);
  } catch {
    return String(payload);
  }
}

export function getPayloadPreview(
  payload: Record<string, unknown> | undefined,
  maxLength = 64,
): string {
  const formatted = formatPayloadJson(payload, 0);

  if (formatted.length <= maxLength) return formatted;

  return `${formatted.slice(0, maxLength)}…`;
}

export interface EventFilters {
  search: string;
  status: string;
  tracking: EventTrackingFilter;
}

export function filterEvents(events: Event[], filters: EventFilters) {
  const search = filters.search.trim().toLowerCase();

  return events.filter((event) => {
    if (filters.status !== 'all' && event.status !== filters.status) {
      return false;
    }

    if (filters.tracking === 'pending' && isEventProcessed(event)) {
      return false;
    }

    if (filters.tracking === 'processed' && !isEventProcessed(event)) {
      return false;
    }

    if (!search) return true;

    const payload = formatPayloadJson(getEventPayload(event), 0).toLowerCase();

    return (
      event.title.toLowerCase().includes(search)
      || event.code.toLowerCase().includes(search)
      || event.message.toLowerCase().includes(search)
      || event.eventType.toLowerCase().includes(search)
      || event.clientSystem?.name?.toLowerCase().includes(search)
      || payload.includes(search)
    );
  });
}
