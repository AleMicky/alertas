'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  formatEventDate,
  getEventTimestamp,
  isEventProcessed,
} from './event-utils';

interface Props {
  event: Event;
}

type StepState = 'done' | 'current' | 'upcoming';

function StepIcon({ state }: { state: StepState }) {
  if (state === 'done') {
    return <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />;
  }

  if (state === 'current') {
    return <Clock className="size-4 text-primary animate-pulse" />;
  }

  return <Circle className="size-4 text-muted-foreground/50" />;
}

export function EventTrackingSteps({ event }: Props) {
  const processed = isEventProcessed(event);
  const isPending = event.status?.toUpperCase() === 'PENDING';
  const isProcessing = event.status?.toUpperCase() === 'PROCESSING';
  const isFailed = event.status?.toUpperCase() === 'FAILED';

  const steps: {
    id: string;
    title: string;
    description: string;
    state: StepState;
  }[] = [
    {
      id: 'received',
      title: 'Evento recibido',
      description: formatEventDate(getEventTimestamp(event)),
      state: 'done',
    },
    {
      id: 'processing',
      title: isProcessing ? 'En procesamiento' : 'Procesamiento',
      description: isProcessing
        ? 'El evento está siendo evaluado por las reglas de alerta.'
        : processed || isFailed
          ? 'Etapa de reglas y notificaciones completada.'
          : 'Esperando procesamiento.',
      state: isProcessing
        ? 'current'
        : processed || isFailed
          ? 'done'
          : isPending
            ? 'upcoming'
            : 'current',
    },
    {
      id: 'processed',
      title: isFailed
        ? 'Fallido'
        : processed
          ? 'Procesado'
          : 'Pendiente de cierre',
      description: event.processedAt
        ? formatEventDate(event.processedAt)
        : isFailed
          ? 'El evento terminó con error.'
          : 'Aún no se registra fecha de cierre.',
      state: processed || isFailed ? 'done' : isProcessing ? 'current' : 'upcoming',
    },
  ];

  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              className={cn(
                'absolute left-[8px] top-5 h-[calc(100%-10px)] w-px',
                step.state === 'done' ? 'bg-emerald-500/50' : 'bg-border',
              )}
              aria-hidden
            />
          ) : null}

          <div className="relative z-10 mt-0.5 shrink-0">
            <StepIcon state={step.state} />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5 rounded-md border bg-muted/20 px-2.5 py-2">
            <p className="text-xs font-medium">{step.title}</p>
            <p className="text-[11px] text-muted-foreground">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
