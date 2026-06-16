'use client';

import { useMemo, useState } from 'react';
import { Bell, LayoutList, RefreshCw, ScrollText } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/shared/components/data-table';

import { Alert } from '../alert.types';
import { AlertNotification } from '../alert-notification.types';
import { AlertDetailSheet } from './alert-detail-sheet';
import { createAlertColumns } from './alert-columns';
import { AlertsFilters } from './alerts-filters';
import { AlertsLogPanel } from './alerts-log-panel';
import { AlertsMetricsHeader } from './alerts-metrics-header';
import { NotificationsLogPanel } from './notifications-log-panel';
import {
  AlertFilters,
  filterAlerts,
  sortAlertsByDateDesc,
} from './alert-utils';

interface Props {
  alerts: Alert[];
  notifications: AlertNotification[];
  notificationsLoading?: boolean;
  isFetching?: boolean;
}

const defaultFilters: AlertFilters = {
  search: '',
  status: 'all',
  attention: 'all',
};

export function AlertsDashboardView({
  alerts,
  notifications,
  notificationsLoading = false,
  isFetching,
}: Props) {
  const [selected, setSelected] = useState<Alert | null>(null);
  const [filters, setFilters] = useState<AlertFilters>(defaultFilters);

  const filtered = useMemo(
    () => sortAlertsByDateDesc(filterAlerts(alerts, filters)),
    [alerts, filters],
  );

  const columns = useMemo(
    () =>
      createAlertColumns({
        onView: setSelected,
      }),
    [],
  );

  return (
    <div className="space-y-3">
      <AlertsMetricsHeader
        data={alerts}
        activeStatus={filters.status}
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))}
      />

      <Tabs defaultValue="log" className="space-y-2">
        <div className="flex flex-col gap-2 rounded-lg border bg-card/50 p-2.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <AlertsFilters
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            isFetching={isFetching}
          />

          <div className="flex items-center gap-2 self-end lg:self-auto">
            {isFetching ? (
              <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
            ) : null}
            <TabsList className="h-7">
              <TabsTrigger value="log" className="gap-1 px-2 text-[10px]">
                <ScrollText className="size-3" />
                Log
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-1 px-2 text-[10px]">
                <LayoutList className="size-3" />
                Tabla
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1 px-2 text-[10px]">
                <Bell className="size-3" />
                Entregas
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="log" className="mt-0">
          <AlertsLogPanel
            alerts={filtered}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <DataTable
            columns={columns}
            data={filtered}
            searchColumn="title"
            searchPlaceholder="Filtrar en tabla…"
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          {notificationsLoading ? (
            <p className="px-2 font-mono text-[11px] text-muted-foreground">
              Cargando entregas…
            </p>
          ) : (
            <NotificationsLogPanel
              data={notifications}
              alerts={alerts}
              onAlertSelect={setSelected}
            />
          )}
        </TabsContent>
      </Tabs>

      <AlertDetailSheet
        alert={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
