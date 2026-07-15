'use client';

import { Bell, CheckCircle2, Layers, Monitor, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
  NOTIFICATION_REQUEST_STATUS_LABELS,
} from '../notification-request.utils';
import { NotificationRequestStats } from '../notification-request.types';

interface Props {
  stats?: NotificationRequestStats;
  isLoading?: boolean;
}

export function NotificationRequestMetrics({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-border/50 py-0 shadow-sm">
            <CardHeader className="px-4 py-3">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const sentCount =
    stats?.byStatus.find((row) => row.key === 'SENT')?.count ?? 0;
  const failedCount =
    stats?.byStatus.find((row) => row.key === 'FAILED')?.count ?? 0;
  const processingCount =
    (stats?.byStatus.find((row) => row.key === 'PROCESSING')?.count ?? 0) +
    (stats?.byStatus.find((row) => row.key === 'QUEUED')?.count ?? 0);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-border/50 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div>
            <CardDescription className="text-xs">Total</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stats?.total ?? 0}
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
            <Bell className="size-4 text-primary" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/50 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div>
            <CardDescription className="text-xs">Enviadas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-600">
              {sentCount}
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/50 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div>
            <CardDescription className="text-xs">En proceso</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-blue-600">
              {processingCount}
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-blue-500/10">
            <Layers className="size-4 text-blue-600" />
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/50 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
          <div>
            <CardDescription className="text-xs">Fallidas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums text-destructive">
              {failedCount}
            </CardTitle>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-4 text-destructive" />
          </div>
        </CardHeader>
      </Card>

      {stats && stats.byStatus.length > 0 ? (
        <Card className="border-border/50 py-0 shadow-sm sm:col-span-2 xl:col-span-2">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm">Por estado</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 px-4 pb-4">
            {stats.byStatus.map((row) => (
              <Badge key={row.key} variant="outline" className="gap-1.5">
                {NOTIFICATION_REQUEST_STATUS_LABELS[
                  row.key as keyof typeof NOTIFICATION_REQUEST_STATUS_LABELS
                ] ?? row.key}
                <span className="font-mono text-[10px]">{row.count}</span>
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {stats && stats.byClientSystem.length > 0 ? (
        <Card className="border-border/50 py-0 shadow-sm sm:col-span-2 xl:col-span-2">
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Monitor className="size-4" />
              Por sistema cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 px-4 pb-4">
            {stats.byClientSystem.map((row) => (
              <Badge key={row.key} variant="secondary" className="gap-1.5">
                {row.key}
                <span className="font-mono text-[10px]">{row.count}</span>
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
