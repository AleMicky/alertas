import { NotificationRequestStatus } from '@/features/notification-requests/notification-request.types';

export const DASHBOARD_RECENT_LIMIT = 5;
export const DASHBOARD_STATS_DAYS = 7;

export function getDashboardStatsFromDate(
  days = DASHBOARD_STATS_DAYS,
): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function getStatusBadgeClass(status: NotificationRequestStatus): string {
  switch (status) {
    case 'SENT':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400';
    case 'PROCESSING':
    case 'QUEUED':
      return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400';
    case 'FAILED':
    case 'CANCELED':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400';
    case 'RECEIVED':
    case 'PARTIAL':
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}
