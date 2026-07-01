'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/api-response';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';

import { notificationChannelProviderService } from '../notification-channel-provider.service';
import {
  CreateNotificationChannelProviderDto,
  UpdateNotificationChannelProviderDto,
} from '../notification-channel-provider.schema';
import {
  NotificationChannelProvider,
  TestNotificationChannelProviderDto,
} from '../notification-channel-provider.types';

const entityName = 'Proveedor de canal';

export function useNotificationChannelProviderMutations() {
  const queryClient = useQueryClient();
  const baseMutations = useBaseEntityMutations<
    NotificationChannelProvider,
    CreateNotificationChannelProviderDto,
    UpdateNotificationChannelProviderDto
  >(notificationChannelProviderService, {
    queryKey: QUERY_KEYS.notificationChannelProviders,
    entityName,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.notificationChannelProviders],
    });
  };

  const activateMutation = useMutation({
    mutationFn: notificationChannelProviderService.activate,
    onSuccess: () => {
      invalidate();
      toast.success('Proveedor activado correctamente');
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, 'No se pudo activar el proveedor'),
      );
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: notificationChannelProviderService.deactivate,
    onSuccess: () => {
      invalidate();
      toast.success('Proveedor desactivado correctamente');
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, 'No se pudo desactivar el proveedor'),
      );
    },
  });

  const validateMutation = useMutation({
    mutationFn: notificationChannelProviderService.validate,
    onSuccess: (result) => {
      if (result.valid) {
        toast.success('La configuración del proveedor es válida');
        return;
      }

      toast.error(result.errors.join(', ') || 'Configuración inválida');
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, 'No se pudo validar el proveedor'),
      );
    },
  });

  const testMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data?: TestNotificationChannelProviderDto;
    }) => notificationChannelProviderService.test(id, data),
    onSuccess: () => {
      toast.success('Webhook probado correctamente');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo probar el webhook'));
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
    validate: validateMutation.mutate,
    validateAsync: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
    test: testMutation.mutate,
    testAsync: testMutation.mutateAsync,
    isTesting: testMutation.isPending,
  };
}
