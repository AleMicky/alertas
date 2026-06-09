'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Event } from '../event.types';
import {
  groupEventsByStatus,
  isEventProcessed,
} from './event-utils';

interface Props {
  data: Event[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: typeof Layers;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden border-muted/60 shadow-sm">
      <div className={cn('absolute inset-y-0 left-0 w-1', accent)} />
      <CardContent className="flex items-center gap-4 p-4 pl-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted/60">
          <Icon className="size-5 text-foreground/80" />
        </div>
        <div>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsTrackingHeader({
  data,
  activeStatus,
  onStatusChange,
}: Props) {
  const pending = data.filter((item) => !isEventProcessed(item)).length;
  const processed = data.filter((item) => isEventProcessed(item)).length;
  const statusGroups = groupEventsByStatus(data);
  const total = data.length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Layers}
          label="En seguimiento"
          value={total}
          hint="Eventos en el periodo visible"
          accent="bg-primary"
        />
        <MetricCard
          icon={Clock}
          label="Pendientes"
          value={pending}
          hint="Sin fecha de procesamiento"
          accent="bg-amber-500"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Procesados"
          value={processed}
          hint="Con processedAt registrado"
          accent="bg-emerald-500"
        />
        <MetricCard
          icon={AlertCircle}
          label="Estados distintos"
          value={statusGroups.length}
          hint="Agrupación por status API"
          accent="bg-violet-500"
        />
      </div>

      {statusGroups.length > 0 ? (
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Pipeline por estado</p>
              <p className="text-xs text-muted-foreground">
                Clic para filtrar el seguimiento
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onStatusChange('all')}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  activeStatus === 'all'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted',
                )}
              >
                Todos ({total})
              </button>

              {statusGroups.map(({ status, count }) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
                    activeStatus === status
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-muted',
                  )}
                >
                  {status.replaceAll('_', ' ')} ({count})
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}


/*
$_SESSION['_MAIL_USUARIO']='faviana.pimentel@endecorani.bo';
$_SESSION['_MAIL_PASSWORD']='password...';
$_SESSION['_MAIL_REMITENTE']='motifacion@endecorani.bo';   
$_SESSION['_MAIL_SERVIDOR']='smtp.gmail.com';
$_SESSION['_MAIL_PUERTO']=587;
$_SESSION['_MAIL_AUTENTIFICACION']=true;
$_SESSION['_SMTPSecure']='tls';
*/