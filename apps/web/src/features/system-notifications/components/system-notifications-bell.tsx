'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useSystemNotificationArrivalAlerts } from '../hooks/use-system-notification-arrival-alerts';
import { useSystemNotificationMutations } from '../hooks/use-system-notification-mutations';
import {
  useSystemNotificationUnreadCountQuery,
  useSystemNotificationsQuery,
} from '../hooks/use-system-notifications-query';
import { SystemNotification } from '../system-notification.types';
import { formatRelativeTime } from '../system-notification.utils';

export function SystemNotificationsBell() {
  const router = useRouter();
  useSystemNotificationArrivalAlerts();
  const { data: notifications = [], isLoading } = useSystemNotificationsQuery({
    limit: 15,
  });
  const { data: unread } = useSystemNotificationUnreadCountQuery();
  const { markAsRead, markAllAsRead, isMarkingAllAsRead } =
    useSystemNotificationMutations();

  const unreadCount = unread?.count ?? 0;

  const handleOpen = (notification: SystemNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.href) {
      router.push(notification.href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative size-7 text-muted-foreground hover:text-foreground"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} notificaciones sin leer`
                : 'Notificaciones del sistema'
            }
          />
        }
      >
        <Bell className="size-4" aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-foreground">
            <span>Notificaciones</span>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                disabled={isMarkingAllAsRead}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  markAllAsRead();
                }}
              >
                Marcar todas
              </button>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuGroup className="max-h-80 overflow-y-auto py-1">
          {isLoading ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              Cargando…
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No hay notificaciones
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'cursor-pointer items-start gap-2.5 rounded-none px-3 py-2.5',
                  !notification.read && 'bg-primary/5',
                )}
                onClick={() => handleOpen(notification)}
              >
                <span
                  className={cn(
                    'mt-1.5 size-1.5 shrink-0 rounded-full',
                    notification.read ? 'bg-transparent' : 'bg-primary',
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  {notification.body ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {notification.body}
                    </p>
                  ) : null}
                  <p className="text-[11px] text-muted-foreground/80">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuGroup className="px-2 py-1.5">
          <DropdownMenuItem
            className="justify-center text-xs font-medium text-muted-foreground"
            render={<Link href="/notification-requests" />}
          >
            Ver solicitudes
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
