'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Alert } from '../alert.types';
import {
  getAlertStatusTone,
  getRelativeTime,
  getSeverityBadgeVariant,
  sortAlertsByDateDesc,
} from './alert-utils';

interface Props {
  alerts: Alert[];
}

function countByStatus(alerts: Alert[], status: string) {
  return alerts.filter((item) => item.status === status).length;
}

function SummaryMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className={cn('mb-3 h-1 w-8 rounded-full', accent)} />
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function AlertsHomeSummary({ alerts }: Props) {
  const recent = sortAlertsByDateDesc(alerts).slice(0, 5);
  const open = countByStatus(alerts, 'OPEN');
  const resolved = countByStatus(alerts, 'RESOLVED');
  const failed = countByStatus(alerts, 'FAILED');

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryMetric label="Abiertas" value={open} accent="bg-amber-500" />
        <SummaryMetric label="Resueltas" value={resolved} accent="bg-emerald-500" />
        <SummaryMetric label="Fallidas" value={failed} accent="bg-destructive" />
      </div>

      <Card className="border-muted/60 shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <BellRing className="size-4" />
              Alertas recientes
            </CardTitle>
            <CardDescription>
              Últimas alertas registradas en el sistema.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/alerts" />}>
            Ver todas
            <ArrowRight className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-2">
          {recent.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No hay alertas registradas todavía.
            </p>
          ) : (
            recent.map((alert) => {
              const statusTone = getAlertStatusTone(alert.status);

              return (
                <Link
                  key={alert.id}
                  href="/alerts"
                  className="flex items-start justify-between gap-3 rounded-lg border bg-muted/10 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(alert.alertDate)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                        statusTone.badge,
                      )}
                    >
                      {alert.status}
                    </span>
                    <Badge variant={getSeverityBadgeVariant(alert.severityLevel?.priority)}>
                      {alert.severityLevel?.name ?? '—'}
                    </Badge>
                  </div>
                </Link>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium">Ciclo operativo</p>
              <p className="text-xs text-muted-foreground">
                {resolved} alertas cerradas correctamente
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="size-8 text-destructive" />
            <div>
              <p className="text-sm font-medium">Atención requerida</p>
              <p className="text-xs text-muted-foreground">
                {open + failed} alertas abiertas o fallidas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
