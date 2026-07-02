import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';

import {
  ArchiveNotificationRequestsFormValues,
  ChangeNotificationRequestStatusFormValues,
  ScheduleNotificationRequestFormValues,
} from './notification-request.schema';
import {
  NotificationRequestDetail,
  NotificationRequestSearchFilters,
  NotificationRequestSearchResult,
  NotificationRequestStats,
  NotificationRequestStatsFilters,
} from './notification-request.types';

const endpoint = '/notification-requests';

function buildQueryParams(
  filters: Record<string, string | number | boolean | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    params.set(key, String(value));
  });

  return params;
}

export const notificationRequestService = {
  search: async (
    filters: NotificationRequestSearchFilters = {},
  ): Promise<NotificationRequestSearchResult> =>
    unwrapApiResponse<NotificationRequestSearchResult>(
      (
        await http.get(endpoint, {
          params: buildQueryParams(
            filters as Record<string, string | number | boolean | undefined>,
          ),
        })
      ).data,
    ),

  getStats: async (
    filters: NotificationRequestStatsFilters = {},
  ): Promise<NotificationRequestStats> =>
    unwrapApiResponse<NotificationRequestStats>(
      (
        await http.get(`${endpoint}/stats`, {
          params: buildQueryParams(
            filters as Record<string, string | number | boolean | undefined>,
          ),
        })
      ).data,
    ),

  getById: async (id: string): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.get(`${endpoint}/${id}`)).data,
    ),

  cancel: async (id: string): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/cancel`)).data,
    ),

  requeue: async (id: string): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/requeue`)).data,
    ),

  retryFailed: async (id: string): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/retry-failed`)).data,
    ),

  recalculateStatus: async (id: string): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/recalculate-status`)).data,
    ),

  schedule: async (
    id: string,
    data: ScheduleNotificationRequestFormValues,
  ): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/schedule`, data)).data,
    ),

  changeStatus: async (
    id: string,
    data: ChangeNotificationRequestStatusFormValues,
  ): Promise<NotificationRequestDetail> =>
    unwrapApiResponse<NotificationRequestDetail>(
      (await http.patch(`${endpoint}/${id}/status`, data)).data,
    ),

  archive: async (
    data: ArchiveNotificationRequestsFormValues,
  ): Promise<{ archivedCount: number; olderThan: string }> =>
    unwrapApiResponse<{ archivedCount: number; olderThan: string }>(
      (await http.post(`${endpoint}/archive`, data)).data,
    ),

  delete: async (id: string): Promise<void> => {
    await http.delete(`${endpoint}/${id}`);
  },
};
