'use client';

import type { ReactNode } from 'react';
import { Bell, CheckCircle2, Layers, XCircle } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationRequestStats } from '@/features/notification-requests/notification-request.types';
import { cn } from '@/lib/utils';

import { DASHBOARD_STATS_DAYS } from '../dashboard.utils';

interface MetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: 'default' | 'success' | 'info' | 'danger';
}

function MetricCard({ label, value, icon, tone = 'default' }: MetricCardProps) {
  const toneClasses = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-blue-600 dark:text-blue-400',
    danger: 'text-red-600 dark:text-red-400',
  }[tone];

  const iconBgClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
  }[tone];

  return (
    <Card className="border-border/60 bg-card py-0 shadow-sm transition-colors hover:border-border hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-3.5 py-2.5">
        <div className="min-w-0 space-y-0.5">
          <CardDescription className="text-[11px] font-medium uppercase tracking-wide">
            {label}
          </CardDescription>
          <CardTitle
            className={cn(
              'text-xl font-semibold tabular-nums leading-none',
              toneClasses,
            )}
          >
            {value}
          </CardTitle>
        </div>
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md',
            iconBgClasses,
          )}
        >
          {icon}
        </div>
      </CardHeader>
    </Card>
  );
}

interface Props {
  stats?: NotificationRequestStats;
  isLoading?: boolean;
}

export function DashboardMetrics({ stats, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="space-y-2">
        <p className="text-[11px] text-muted-foreground">
          Últimos {DASHBOARD_STATS_DAYS} días
        </p>
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-border/60 bg-card py-0 shadow-sm"
            >
              <CardHeader className="px-3.5 py-2.5">
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-6 w-12" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
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
    <section className="space-y-2">
      <p className="text-[11px] text-muted-foreground">
        Solicitudes · últimos {DASHBOARD_STATS_DAYS} días
      </p>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <MetricCard
          label="Total"
          value={stats?.total ?? 0}
          icon={<Bell className="size-3.5" />}
        />
        <MetricCard
          label="Enviadas"
          value={sentCount}
          tone="success"
          icon={<CheckCircle2 className="size-3.5" />}
        />
        <MetricCard
          label="En proceso"
          value={processingCount}
          tone="info"
          icon={<Layers className="size-3.5" />}
        />
        <MetricCard
          label="Fallidas"
          value={failedCount}
          tone="danger"
          icon={<XCircle className="size-3.5" />}
        />
      </div>
    </section>
  );
}
