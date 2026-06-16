'use client';

import { useMemo, useState } from 'react';
import { LayoutList, RefreshCw, ScrollText } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Event } from '../event.types';
import { EventDetailSheet } from './event-detail-sheet';
import { createEventColumns } from './event-columns';
import { DataTable } from '@/shared/components/data-table';
import { EventsLogPanel } from './events-log-panel';
import { EventsTrackingFilters } from './events-tracking-filters';
import { EventsTrackingHeader } from './events-tracking-header';
import {
  EventFilters,
  filterEvents,
  sortEventsByDateDesc,
} from './event-utils';

interface Props {
  data: Event[];
  isFetching?: boolean;
}

const defaultFilters: EventFilters = {
  search: '',
  status: 'all',
  tracking: 'all',
};

export function EventsTrackingView({ data, isFetching }: Props) {
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
    <div className="space-y-3">
      <EventsTrackingHeader
        data={data}
        activeStatus={filters.status}
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))}
      />

      <Tabs defaultValue="log" className="space-y-2">
        <div className="flex flex-col gap-2 rounded-lg border bg-card/50 p-2.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <EventsTrackingFilters
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
            </TabsList>
          </div>
        </div>

        <TabsContent value="log" className="mt-0">
          <EventsLogPanel
            events={filtered}
            selectedId={selected?.id}
            onSelect={setSelected}
          />
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <DataTable
            columns={columns}
            data={filtered}
            searchColumn="eventType"
            searchPlaceholder="Filtrar en tabla…"
          />
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
