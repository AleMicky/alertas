'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  playSystemNotificationSound,
  unlockSystemNotificationAudio,
} from '../system-notification-sound';
import { useSystemNotificationsQuery } from './use-system-notifications-query';

const MAX_TOASTS_PER_BATCH = 3;

export function useSystemNotificationArrivalAlerts() {
  const router = useRouter();
  const { data: notifications } = useSystemNotificationsQuery({
    limit: 15,
  });
  const seenIdsRef = useRef<Set<string> | null>(null);

  // Unlock AudioContext after the first user gesture (browser autoplay policy).
  useEffect(() => {
    const unlock = () => {
      void unlockSystemNotificationAudio();
    };

    window.addEventListener('pointerdown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!notifications) {
      return;
    }

    if (seenIdsRef.current === null) {
      seenIdsRef.current = new Set(
        notifications.map((notification) => notification.id),
      );
      return;
    }

    const incoming = notifications.filter(
      (notification) =>
        !notification.read && !seenIdsRef.current!.has(notification.id),
    );

    for (const notification of notifications) {
      seenIdsRef.current.add(notification.id);
    }

    if (incoming.length === 0) {
      return;
    }

    void playSystemNotificationSound();

    const toasts = incoming.slice(0, MAX_TOASTS_PER_BATCH);

    for (const notification of toasts) {
      toast.info(notification.title, {
        description: notification.body ?? undefined,
        duration: 6_000,
        action: notification.href
          ? {
              label: 'Ver',
              onClick: () => {
                router.push(notification.href!);
              },
            }
          : undefined,
      });
    }

    if (incoming.length > MAX_TOASTS_PER_BATCH) {
      toast.info(
        `${incoming.length - MAX_TOASTS_PER_BATCH} notificaciones más`,
        { duration: 4_000 },
      );
    }
  }, [notifications, router]);
}
