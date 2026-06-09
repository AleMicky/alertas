'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  formatEventDate,
  isEventProcessed,
} from './event-utils';

interface Props {
  event: Event;
}

type StepState = 'done' | 'current' | 'upcoming';

function StepIcon({ state }: { state: StepState }) {
  if (state === 'done') {
    return <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />;
  }

  if (state === 'current') {
    return <Clock className="size-5 text-primary animate-pulse" />;
  }

  return <Circle className="size-5 text-muted-foreground/50" />;
}

export function EventTrackingSteps({ event }: Props) {
  const processed = isEventProcessed(event);

  const steps: {
    id: string;
    title: string;
    description: string;
    state: StepState;
  }[] = [
    {
      id: 'received',
      title: 'Evento registrado',
      description: formatEventDate(event.eventDate),
      state: 'done',
    },
    {
      id: 'active',
      title: event.active ? 'Activo en cola' : 'Inactivo',
      description: event.active
        ? 'El evento sigue visible para seguimiento operativo.'
        : 'Marcado como inactivo en el sistema.',
      state: event.active && !processed ? 'current' : processed ? 'done' : 'upcoming',
    },
    {
      id: 'processed',
      title: processed ? 'Procesado' : 'Pendiente de procesar',
      description: processed
        ? formatEventDate(event.processedAt)
        : 'Aún no se registra fecha de procesamiento.',
      state: processed ? 'done' : event.active ? 'current' : 'upcoming',
    },
  ];

  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              className={cn(
                'absolute left-[10px] top-6 h-[calc(100%-12px)] w-px',
                step.state === 'done' ? 'bg-emerald-500/50' : 'bg-border',
              )}
              aria-hidden
            />
          ) : null}

          <div className="relative z-10 mt-0.5 shrink-0">
            <StepIcon state={step.state} />
          </div>

          <div className="min-w-0 flex-1 space-y-1 rounded-lg border bg-muted/20 p-3">
            <p className="text-sm font-medium">{step.title}</p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
