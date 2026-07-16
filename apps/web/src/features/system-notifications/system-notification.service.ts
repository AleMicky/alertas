import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';

import {
  SystemNotification,
  SystemNotificationMarkAllReadResult,
  SystemNotificationUnreadCount,
} from './system-notification.types';

const endpoint = '/system-notifications';

export const systemNotificationService = {
  list: async (options?: {
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<SystemNotification[]> =>
    unwrapApiResponse<SystemNotification[]>(
      (
        await http.get(endpoint, {
          params: {
            limit: options?.limit ?? 20,
            unreadOnly: options?.unreadOnly,
          },
        })
      ).data,
    ),

  unreadCount: async (): Promise<SystemNotificationUnreadCount> =>
    unwrapApiResponse<SystemNotificationUnreadCount>(
      (await http.get(`${endpoint}/unread-count`)).data,
    ),

  markAsRead: async (id: string): Promise<SystemNotification> =>
    unwrapApiResponse<SystemNotification>(
      (await http.patch(`${endpoint}/${id}/read`)).data,
    ),

  markAllAsRead: async (): Promise<SystemNotificationMarkAllReadResult> =>
    unwrapApiResponse<SystemNotificationMarkAllReadResult>(
      (await http.post(`${endpoint}/read-all`)).data,
    ),
};
