'use client';

import { EventsTrackingView } from './events-tracking-view';

import { Event } from '../event.types';

interface Props {
  data: Event[];
  isFetching?: boolean;
}

/** Vista principal de seguimiento de eventos */
export function EventsTable({ data, isFetching }: Props) {
  return <EventsTrackingView data={data} isFetching={isFetching} />;
}
