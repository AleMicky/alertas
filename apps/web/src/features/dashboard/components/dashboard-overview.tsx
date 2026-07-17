'use client';

import { useMemo } from 'react';
import { AlertTriangle, Clock3 } from 'lucide-react';

import { useProfileQuery } from '@/features/auth/hooks/use-profile-query';
import { useClientSystemsQuery } from '@/features/client-systems/hooks/client-system/use-client-system-query';
import { useNotificationChannelProvidersQuery } from '@/features/notification-channel-providers/hooks/use-notification-channel-provider-query';
import { useNotificationChannelsQuery } from '@/features/notification-channels/hooks/use-notification-channel-query';
import { useNotificationPayloadSchemasQuery } from '@/features/notification-payload-schemas/hooks/use-notification-payload-schema-query';
import { useNotificationRequestSearchQuery } from '@/features/notification-requests/hooks/use-notification-request-search-query';
import { useNotificationRequestStatsQuery } from '@/features/notification-requests/hooks/use-notification-request-stats-query';
import { NOTIFICATION_REQUEST_DASHBOARD_POLL_MS } from '@/features/notification-requests/notification-request.utils';
import { PageHeader } from '@/shared/components';

import {
  DASHBOARD_RECENT_LIMIT,
  getDashboardStatsFromDate,
} from '../dashboard.utils';
import { DashboardMetrics } from './dashboard-metrics';
import { DashboardQuickLinks } from './dashboard-quick-links';
import { DashboardRequestList } from './dashboard-request-list';

const dashboardPoll = {
  refetchIntervalMs: NOTIFICATION_REQUEST_DASHBOARD_POLL_MS,
} as const;

export function DashboardOverview() {
  const statsFrom = useMemo(() => getDashboardStatsFromDate(), []);

  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery();
  const { data: stats, isLoading: isLoadingStats } =
    useNotificationRequestStatsQuery(
      {
        requestedFrom: statsFrom,
      },
      dashboardPoll,
    );
  const { data: recentResult, isLoading: isLoadingRecent } =
    useNotificationRequestSearchQuery(
      {
        page: 1,
        size: DASHBOARD_RECENT_LIMIT,
      },
      dashboardPoll,
    );
  const { data: failedResult, isLoading: isLoadingFailed } =
    useNotificationRequestSearchQuery(
      {
        status: 'FAILED',
        page: 1,
        size: DASHBOARD_RECENT_LIMIT,
      },
      dashboardPoll,
    );
  const { data: clientSystems, isLoading: isLoadingSystems } =
    useClientSystemsQuery();
  const { data: channels, isLoading: isLoadingChannels } =
    useNotificationChannelsQuery();
  const { data: providers, isLoading: isLoadingProviders } =
    useNotificationChannelProvidersQuery();
  const { data: schemas, isLoading: isLoadingSchemas } =
    useNotificationPayloadSchemasQuery();

  const greetingName =
    profile?.fullName?.trim() || profile?.username?.trim() || null;
  const title = greetingName ? `Hola, ${greetingName}` : 'Dashboard';
  const description = greetingName
    ? 'Resumen operativo del sistema de notificaciones.'
    : 'Panel de administración del sistema de notificaciones.';

  const systems = clientSystems ?? [];
  const channelList = channels ?? [];

  return (
    <main className="space-y-5">
      <PageHeader
        title={isLoadingProfile && !greetingName ? 'Dashboard' : title}
        description={description}
      />

      <DashboardMetrics stats={stats} isLoading={isLoadingStats} />

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardRequestList
          title="Últimas solicitudes"
          description="Actividad reciente en el sistema"
          icon={Clock3}
          items={recentResult?.items ?? []}
          isLoading={isLoadingRecent}
          emptyTitle="Sin solicitudes recientes"
          emptyDescription="Cuando lleguen nuevas solicitudes aparecerán aquí."
          viewAllHref="/notification-requests"
          clientSystems={systems}
          channels={channelList}
        />
        <DashboardRequestList
          title="Requieren atención"
          description="Solicitudes fallidas pendientes de revisión"
          icon={AlertTriangle}
          items={failedResult?.items ?? []}
          isLoading={isLoadingFailed}
          emptyTitle="Sin fallidas"
          emptyDescription="No hay solicitudes fallidas por atender."
          viewAllHref="/notification-requests"
          viewAllLabel="Ver fallidas"
          clientSystems={systems}
          channels={channelList}
        />
      </div>

      <DashboardQuickLinks
        clientSystemsCount={systems.length}
        channelsCount={channelList.length}
        providersCount={providers.length}
        schemasCount={schemas.length}
        isLoading={
          isLoadingSystems ||
          isLoadingChannels ||
          isLoadingProviders ||
          isLoadingSchemas
        }
      />
    </main>
  );
}
