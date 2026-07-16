'use client';

import Link from 'next/link';
import { ArrowRight, Inbox, type LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientSystem } from '@/features/client-systems/types/client-system.types';
import { NotificationChannel } from '@/features/notification-channels/notification-channel.types';
import { NotificationRequest } from '@/features/notification-requests/notification-request.types';
import { NOTIFICATION_REQUEST_STATUS_LABELS } from '@/features/notification-requests/notification-request.utils';
import { formatRelativeTime } from '@/features/system-notifications/system-notification.utils';
import { cn } from '@/lib/utils';

import { getStatusBadgeClass } from '../dashboard.utils';

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  items: NotificationRequest[];
  isLoading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  viewAllHref: string;
  viewAllLabel?: string;
  clientSystems?: ClientSystem[];
  channels?: NotificationChannel[];
}

export function DashboardRequestList({
  title,
  description,
  icon: Icon,
  items,
  isLoading,
  emptyTitle,
  emptyDescription,
  viewAllHref,
  viewAllLabel = 'Ver todas',
  clientSystems = [],
  channels = [],
}: Props) {
  const systemById = new Map(
    clientSystems.map((system) => [system.id, system]),
  );
  const channelById = new Map(
    channels.map((channel) => [channel.id, channel]),
  );

  return (
    <Card className="overflow-hidden border-border/60 bg-card py-0 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b border-border/50 px-3.5 py-2.5">
        <div className="min-w-0 space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Icon className="size-3.5 text-muted-foreground" aria-hidden />
            {title}
          </CardTitle>
          <CardDescription className="text-[11px]">
            {description}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          nativeButton={false}
          render={<Link href={viewAllHref} />}
        >
          {viewAllLabel}
          <ArrowRight className="size-3" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <ul className="divide-y divide-border/40">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index} className="space-y-2 px-3.5 py-3">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </li>
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <Inbox className="size-4" />
            </div>
            <h3 className="text-sm font-medium text-foreground">{emptyTitle}</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {items.map((item) => {
              const system = systemById.get(item.clientSystemId);
              const channel = item.notificationChannelId
                ? channelById.get(item.notificationChannelId)
                : null;
              const channelCode =
                channel?.code ??
                (typeof item.payload.channel === 'string'
                  ? item.payload.channel
                  : null);
              const label =
                item.title?.trim() ||
                item.externalReference ||
                item.correlationId ||
                item.id.slice(0, 8);

              return (
                <li key={item.id}>
                  <Link
                    href={`/notification-requests?requestId=${item.id}`}
                    className="flex items-start justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/30"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-xs font-medium text-foreground">
                        {label}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {[system?.code, channelCode]
                          .filter(Boolean)
                          .join(' · ') || 'Sin sistema / canal'}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-5 border px-1.5 text-[10px] font-medium',
                          getStatusBadgeClass(item.status),
                        )}
                      >
                        {NOTIFICATION_REQUEST_STATUS_LABELS[item.status]}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(item.requestedAt)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
