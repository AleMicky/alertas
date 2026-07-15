import { z } from 'zod';

import {
  NotificationPriority,
  NotificationRequestStatus,
} from './notification-request.types';

export const scheduleNotificationRequestSchema = z.object({
  scheduledAt: z.string().min(1, 'La fecha programada es obligatoria'),
});

export const changeNotificationRequestStatusSchema = z.object({
  status: z.enum([
    'RECEIVED',
    'QUEUED',
    'PROCESSING',
    'SENT',
    'PARTIAL',
    'FAILED',
    'CANCELED',
  ] satisfies NotificationRequestStatus[]),
  reason: z.string().optional(),
});

export const archiveNotificationRequestsSchema = z.object({
  olderThan: z.string().min(1, 'La fecha límite es obligatoria'),
});

export type ScheduleNotificationRequestFormValues = z.infer<
  typeof scheduleNotificationRequestSchema
>;

export type ChangeNotificationRequestStatusFormValues = z.infer<
  typeof changeNotificationRequestStatusSchema
>;

export type ArchiveNotificationRequestsFormValues = z.infer<
  typeof archiveNotificationRequestsSchema
>;

export const NOTIFICATION_REQUEST_STATUS_OPTIONS: NotificationRequestStatus[] =
  [
    'RECEIVED',
    'QUEUED',
    'PROCESSING',
    'SENT',
    'PARTIAL',
    'FAILED',
    'CANCELED',
  ];

export const NOTIFICATION_PRIORITY_OPTIONS: NotificationPriority[] = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
];
