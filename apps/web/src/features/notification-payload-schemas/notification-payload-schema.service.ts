import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';
import { baseService } from '@/shared/core/base.service';

import {
  CreateNotificationPayloadSchemaDto,
  UpdateNotificationPayloadSchemaDto,
} from './notification-payload-schema.schema';
import {
  NotificationPayloadSchema,
  PayloadSchemaValidationResult,
  ValidateActiveChannelPayloadResult,
  ValidatePayloadSchemaDto,
} from './notification-payload-schema.types';

const endpoint = '/payload-schemas';

const base = baseService<
  NotificationPayloadSchema,
  CreateNotificationPayloadSchemaDto,
  UpdateNotificationPayloadSchemaDto
>(endpoint);

export const notificationPayloadSchemaService = {
  ...base,

  getByChannel: async (
    notificationChannelId: string,
  ): Promise<NotificationPayloadSchema[]> =>
    unwrapApiResponse<NotificationPayloadSchema[]>(
      (await http.get(`${endpoint}/by-channel/${notificationChannelId}`)).data,
    ),

  getActiveByChannelCode: async (
    channelCode: string,
  ): Promise<NotificationPayloadSchema> =>
    unwrapApiResponse<NotificationPayloadSchema>(
      (await http.get(`${endpoint}/active/${channelCode}`)).data,
    ),

  activate: async (id: string): Promise<NotificationPayloadSchema> =>
    unwrapApiResponse<NotificationPayloadSchema>(
      (await http.patch(`${endpoint}/${id}/activate`)).data,
    ),

  deactivate: async (id: string): Promise<NotificationPayloadSchema> =>
    unwrapApiResponse<NotificationPayloadSchema>(
      (await http.patch(`${endpoint}/${id}/deactivate`)).data,
    ),

  validatePayload: async (
    id: string,
    data: ValidatePayloadSchemaDto,
  ): Promise<PayloadSchemaValidationResult> =>
    unwrapApiResponse<PayloadSchemaValidationResult>(
      (await http.post(`${endpoint}/${id}/validate`, data)).data,
    ),

  validatePayloadAgainstActiveChannel: async (
    channelCode: string,
    data: ValidatePayloadSchemaDto,
  ): Promise<ValidateActiveChannelPayloadResult> =>
    unwrapApiResponse<ValidateActiveChannelPayloadResult>(
      (await http.post(`${endpoint}/active/${channelCode}/validate`, data)).data,
    ),
};
