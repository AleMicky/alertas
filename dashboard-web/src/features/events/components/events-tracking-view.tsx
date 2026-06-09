'use client';

import { useMemo, useState } from 'react';
import { LayoutList, Route } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Event } from '../event.types';
import { EventDetailSheet } from './event-detail-sheet';
import { createEventColumns } from './event-columns';
import { DataTable } from '@/shared/components/data-table';
import { EventsTrackingFilters } from './events-tracking-filters';
import { EventsTrackingHeader } from './events-tracking-header';
import { EventsTrackingTimeline } from './events-tracking-timeline';
import {
  EventFilters,
  filterEvents,
  sortEventsByDateDesc,
} from './event-utils';

interface Props {
  data: Event[];
}

const defaultFilters: EventFilters = {
  search: '',
  status: 'all',
  tracking: 'all',
};

export function EventsTrackingView({ data }: Props) {
  const [selected, setSelected] = useState<Event | null>(null);
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const filtered = useMemo(
    () => sortEventsByDateDesc(filterEvents(data, filters)),
    [data, filters],
  );

  const columns = useMemo(
    () =>
      createEventColumns({
        onView: setSelected,
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <EventsTrackingHeader
        data={data}
        activeStatus={filters.status}
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))}
      />

      <EventsTrackingFilters
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      <Tabs defaultValue="timeline">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Seguimiento operativo</h2>
            <p className="text-sm text-muted-foreground">
              Línea de tiempo en tiempo real o vista tabular para auditoría.
            </p>
          </div>

          <TabsList>
            <TabsTrigger value="timeline" className="gap-2">
              <Route className="size-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <LayoutList className="size-4" />
              Tabla
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timeline" className="mt-4">
          <Card className="overflow-hidden border-muted/60 shadow-sm">
            <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
              <CardTitle className="text-base">Línea de tiempo</CardTitle>
              <CardDescription>
                Eventos ordenados por fecha. Selecciona uno para ver el flujo
                completo y el payload.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <EventsTrackingTimeline
                events={filtered}
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
                Misma data filtrada, ideal para exportar o comparar columnas.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <DataTable
                columns={columns}
                data={filtered}
                searchColumn="title"
                searchPlaceholder="Filtrar en tabla…"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EventDetailSheet
        event={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </div>
  );
}
