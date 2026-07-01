'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/api-response';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';

import { notificationPayloadSchemaService } from '../notification-payload-schema.service';
import {
  CreateNotificationPayloadSchemaDto,
  UpdateNotificationPayloadSchemaDto,
} from '../notification-payload-schema.schema';
import {
  NotificationPayloadSchema,
  ValidatePayloadSchemaDto,
} from '../notification-payload-schema.types';

const entityName = 'Schema de payload';

export function useNotificationPayloadSchemaMutations() {
  const queryClient = useQueryClient();
  const baseMutations = useBaseEntityMutations<
    NotificationPayloadSchema,
    CreateNotificationPayloadSchemaDto,
    UpdateNotificationPayloadSchemaDto
  >(notificationPayloadSchemaService, {
    queryKey: QUERY_KEYS.notificationPayloadSchemas,
    entityName,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.notificationPayloadSchemas],
    });
  };

  const activateMutation = useMutation({
    mutationFn: notificationPayloadSchemaService.activate,
    onSuccess: () => {
      invalidate();
      toast.success('Schema activado correctamente');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo activar el schema'));
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: notificationPayloadSchemaService.deactivate,
    onSuccess: () => {
      invalidate();
      toast.success('Schema desactivado correctamente');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo desactivar el schema'));
    },
  });

  const validatePayloadMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ValidatePayloadSchemaDto;
    }) => notificationPayloadSchemaService.validatePayload(id, data),
    onSuccess: (result) => {
      if (result.valid) {
        toast.success('El payload es válido');
        return;
      }

      toast.error(result.errors.join(', ') || 'Payload inválido');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo validar el payload'));
    },
  });

  return {
    ...baseMutations,
    activate: activateMutation.mutate,
    activateAsync: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    deactivate: deactivateMutation.mutate,
    deactivateAsync: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
    validatePayload: validatePayloadMutation.mutate,
    validatePayloadAsync: validatePayloadMutation.mutateAsync,
    isValidatingPayload: validatePayloadMutation.isPending,
  };
}
