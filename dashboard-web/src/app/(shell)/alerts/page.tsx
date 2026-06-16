'use client';

import { AlertsDashboardView } from '@/features/alerts/components/alerts-dashboard-view';
import { useAlertNotificationsQuery } from '@/features/alerts/hooks/use-alert-notifications-query';
import { useAlertQuery } from '@/features/alerts/hooks/use-alert-query';
import {
  LoadingTable,
  PageHeader,
  QueryErrorState,
} from '@/shared/components';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const {
    data: alerts,
    isLoading: alertsLoading,
    isError: alertsError,
    error: alertsFetchError,
    refetch: refetchAlerts,
    isFetching: alertsFetching,
  } = useAlertQuery();

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
    error: notificationsFetchError,
    refetch: refetchNotifications,
    isFetching: notificationsFetching,
  } = useAlertNotificationsQuery();

  const isFetching = alertsFetching || notificationsFetching;

  if (alertsLoading) {
    return (
      <main className="space-y-3 p-4 md:p-5">
        <PageHeader
          title="Log de alertas"
          description="Vista operativa de alertas y entregas por canal."
        />
        <LoadingTable />
      </main>
    );
  }

  if (alertsError) {
    return (
      <main className="space-y-3 p-4 md:p-5">
        <PageHeader
          title="Log de alertas"
          description="Vista operativa de alertas y entregas por canal."
        />
        <QueryErrorState
          title="No se pudieron cargar las alertas"
          error={alertsFetchError}
          onRetry={() => void refetchAlerts()}
        />
      </main>
    );
  }

  return (
    <main className="space-y-3 p-4 md:p-5">
      <PageHeader
        title="Log de alertas"
        description="Stream de alertas y entregas. Clic en una línea para ver detalle y notificaciones."
        action={
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-[10px] uppercase',
              isFetching && 'animate-pulse',
            )}
          >
            {isFetching ? 'sync' : 'live · 15s'}
          </Badge>
        }
      />

      {notificationsError ? (
        <QueryErrorState
          title="Las alertas cargaron, pero fallaron las notificaciones"
          error={notificationsFetchError}
          onRetry={() => void refetchNotifications()}
        />
      ) : null}

      <AlertsDashboardView
        alerts={alerts}
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        isFetching={isFetching}
      />
    </main>
  );
}
