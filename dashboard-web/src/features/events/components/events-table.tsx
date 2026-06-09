'use client';

import { EventsTrackingView } from './events-tracking-view';

import { Event } from '../event.types';

interface Props {
  data: Event[];
}

/** Vista principal de seguimiento de eventos */
export function EventsTable({ data }: Props) {
  return <EventsTrackingView data={data} />;
}
