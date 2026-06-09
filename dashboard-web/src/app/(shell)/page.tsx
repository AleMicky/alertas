'use client';

import { AlertsHomeSummary } from '@/features/alerts/components/alerts-home-summary';
import { useAlertQuery } from '@/features/alerts/hooks/use-alert-query';
import {
  LoadingTable,
  PageHeader,
  QueryErrorState,
} from '@/shared/components';

export default function HomePage() {
  const {
    data: alerts,
    isLoading,
    isError,
    error,
    refetch,
  } = useAlertQuery();

  return (
    <main className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general del sistema de alertas."
      />

      {isLoading ? (
        <LoadingTable />
      ) : isError ? (
        <QueryErrorState
          title="No se pudo cargar el resumen de alertas"
          error={error}
          onRetry={() => void refetch()}
        />
      ) : (
        <AlertsHomeSummary alerts={alerts} />
      )}
    </main>
  );
}
