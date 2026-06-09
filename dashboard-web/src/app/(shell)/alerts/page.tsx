'use client';

import { AlertsDashboardView } from '@/features/alerts/components/alerts-dashboard-view';
import { useAlertNotificationsQuery } from '@/features/alerts/hooks/use-alert-notifications-query';
import { useAlertQuery } from '@/features/alerts/hooks/use-alert-query';
import {
  LoadingTable,
  PageHeader,
  QueryErrorState,
} from '@/shared/components';

export default function AlertsPage() {
  const {
    data: alerts,
    isLoading: alertsLoading,
    isError: alertsError,
    error: alertsFetchError,
    refetch: refetchAlerts,
  } = useAlertQuery();

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
    error: notificationsFetchError,
    refetch: refetchNotifications,
  } = useAlertNotificationsQuery();

  if (alertsLoading) {
    return (
      <main className="space-y-6">
        <PageHeader
          title="Alertas"
          description="Dashboard operativo con estado de alertas y entregas por canal de notificación."
        />
        <LoadingTable />
      </main>
    );
  }

  if (alertsError) {
    return (
      <main className="space-y-6">
        <PageHeader
          title="Alertas"
          description="Dashboard operativo con estado de alertas y entregas por canal de notificación."
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
    <main className="space-y-6">
      <PageHeader
        title="Alertas"
        description="Dashboard operativo con estado de alertas y entregas por canal de notificación."
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
      />
    </main>
  );
}
