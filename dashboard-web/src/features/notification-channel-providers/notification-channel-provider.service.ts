import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';
import { baseService } from '@/shared/core/base.service';

import {
  CreateNotificationChannelProviderDto,
  UpdateNotificationChannelProviderDto,
} from './notification-channel-provider.schema';
import {
  NotificationChannelProvider,
  ProviderValidationResult,
  TestNotificationChannelProviderDto,
  TestNotificationChannelProviderResult,
} from './notification-channel-provider.types';

const endpoint = '/notification-channel-providers';

const base = baseService<
  NotificationChannelProvider,
  CreateNotificationChannelProviderDto,
  UpdateNotificationChannelProviderDto
>(endpoint);

export const notificationChannelProviderService = {
  ...base,

  getByChannel: async (
    notificationChannelId: string,
  ): Promise<NotificationChannelProvider[]> =>
    unwrapApiResponse<NotificationChannelProvider[]>(
      (
        await http.get(
          `${endpoint}/by-channel/${notificationChannelId}`,
        )
      ).data,
    ),

  activate: async (id: string): Promise<NotificationChannelProvider> =>
    unwrapApiResponse<NotificationChannelProvider>(
      (await http.patch(`${endpoint}/${id}/activate`)).data,
    ),

  deactivate: async (id: string): Promise<NotificationChannelProvider> =>
    unwrapApiResponse<NotificationChannelProvider>(
      (await http.patch(`${endpoint}/${id}/deactivate`)).data,
    ),

  validate: async (id: string): Promise<ProviderValidationResult> =>
    unwrapApiResponse<ProviderValidationResult>(
      (await http.post(`${endpoint}/${id}/validate`)).data,
    ),

  test: async (
    id: string,
    data?: TestNotificationChannelProviderDto,
  ): Promise<TestNotificationChannelProviderResult> =>
    unwrapApiResponse<TestNotificationChannelProviderResult>(
      (await http.post(`${endpoint}/${id}/test`, data ?? {})).data,
    ),
};
