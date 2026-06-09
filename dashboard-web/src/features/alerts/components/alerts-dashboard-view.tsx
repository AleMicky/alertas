'use client';

import { useMemo, useState } from 'react';
import { Bell, LayoutGrid, LayoutList } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/shared/components/data-table';

import { Alert } from '../alert.types';
import { AlertNotification } from '../alert-notification.types';
import { AlertDetailSheet } from './alert-detail-sheet';
import { AlertNotificationsPanel } from './alert-notifications-panel';
import { createAlertColumns } from './alert-columns';
import { AlertsFilters } from './alerts-filters';
import { AlertsMetricsHeader } from './alerts-metrics-header';
import { AlertsTimeline } from './alerts-timeline';
import {
  AlertFilters,
  filterAlerts,
  sortAlertsByDateDesc,
} from './alert-utils';

interface Props {
  alerts: Alert[];
  notifications: AlertNotification[];
  notificationsLoading?: boolean;
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
    <div className="space-y-6">
      <AlertsMetricsHeader
        data={alerts}
        activeStatus={filters.status}
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))}
      />

      <AlertsFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      <Tabs defaultValue="cards">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Centro de alertas</h2>
            <p className="text-sm text-muted-foreground">
              Vista visual para móvil, tabla para auditoría y panel de entregas.
            </p>
          </div>

          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="cards" className="gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <LayoutGrid className="size-4" />
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <LayoutList className="size-4" />
              Tabla
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Bell className="size-4" />
              <span className="hidden sm:inline">Notificaciones</span>
              <span className="sm:hidden">Notif.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cards" className="mt-4">
          <Card className="overflow-hidden border-muted/60 shadow-sm">
            <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
              <CardTitle className="text-base">Línea de tiempo</CardTitle>
              <CardDescription>
                Alertas agrupadas por día. Toca una tarjeta para ver detalle y
                notificaciones enviadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <AlertsTimeline
                alerts={filtered}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card className="overflow-hidden border-muted/60 shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Vista tabular</CardTitle>
              <CardDescription>
                Misma data filtrada, ideal para revisión en escritorio.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <DataTable
                columns={columns}
                data={filtered}
                searchColumn="title"
                searchPlaceholder="Filtrar en tabla…"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="overflow-hidden border-muted/60 shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Entregas por canal</CardTitle>
              <CardDescription>
                Estado de cada notificación generada a partir de las alertas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {notificationsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Cargando notificaciones…
                </p>
              ) : (
                <AlertNotificationsPanel data={notifications} />
              )}
            </CardContent>
          </Card>
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
