'use client';

import { useMutation } from '@tanstack/react-query';

import { notificationPayloadSchemaService } from '@/features/notification-payload-schemas/notification-payload-schema.service';
import { ValidateActiveChannelPayloadResult } from '@/features/notification-payload-schemas/notification-payload-schema.types';

export function useNotificationRequestValidatePayload() {
  const mutation = useMutation({
    mutationFn: ({
      channelCode,
      payload,
    }: {
      channelCode: string;
      payload: Record<string, unknown>;
    }): Promise<ValidateActiveChannelPayloadResult> =>
      notificationPayloadSchemaService.validatePayloadAgainstActiveChannel(
        channelCode,
        { payload },
      ),
  });

  return {
    validate: mutation.mutate,
    validateAsync: mutation.mutateAsync,
    isValidating: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
}
