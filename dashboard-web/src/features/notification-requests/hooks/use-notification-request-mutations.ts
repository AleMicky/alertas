'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/api-response';
import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { notificationRequestService } from '../notification-request.service';
import {
  ArchiveNotificationRequestsFormValues,
  ChangeNotificationRequestStatusFormValues,
  ScheduleNotificationRequestFormValues,
} from '../notification-request.schema';

export function useNotificationRequestMutations() {
  const queryClient = useQueryClient();

  const invalidate = (id?: string) => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.notificationRequests],
    });

    if (id) {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.notificationRequests, 'detail', id],
      });
    }
  };

  const cancelMutation = useMutation({
    mutationFn: notificationRequestService.cancel,
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Solicitud cancelada');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo cancelar la solicitud'));
    },
  });

  const requeueMutation = useMutation({
    mutationFn: notificationRequestService.requeue,
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Solicitud reencolada');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo reencolar la solicitud'));
    },
  });

  const retryFailedMutation = useMutation({
    mutationFn: notificationRequestService.retryFailed,
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Reintento de deliveries iniciado');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo reintentar los envíos'));
    },
  });

  const recalculateStatusMutation = useMutation({
    mutationFn: notificationRequestService.recalculateStatus,
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Estado recalculado');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo recalcular el estado'));
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ScheduleNotificationRequestFormValues;
    }) => notificationRequestService.schedule(id, data),
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Envío programado');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo programar el envío'));
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ChangeNotificationRequestStatusFormValues;
    }) => notificationRequestService.changeStatus(id, data),
    onSuccess: (detail) => {
      invalidate(detail.request.id);
      toast.success('Estado actualizado');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo cambiar el estado'));
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (data: ArchiveNotificationRequestsFormValues) =>
      notificationRequestService.archive(data),
    onSuccess: (result) => {
      invalidate();
      toast.success(`${result.archivedCount} solicitudes archivadas`);
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo archivar solicitudes'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationRequestService.delete,
    onSuccess: () => {
      invalidate();
      toast.success('Solicitud eliminada');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'No se pudo eliminar la solicitud'));
    },
  });

  return {
    cancel: cancelMutation.mutate,
    cancelAsync: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
    requeue: requeueMutation.mutate,
    requeueAsync: requeueMutation.mutateAsync,
    isRequeuing: requeueMutation.isPending,
    retryFailed: retryFailedMutation.mutate,
    retryFailedAsync: retryFailedMutation.mutateAsync,
    isRetryingFailed: retryFailedMutation.isPending,
    recalculateStatus: recalculateStatusMutation.mutate,
    recalculateStatusAsync: recalculateStatusMutation.mutateAsync,
    isRecalculating: recalculateStatusMutation.isPending,
    schedule: scheduleMutation.mutate,
    scheduleAsync: scheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    changeStatus: changeStatusMutation.mutate,
    changeStatusAsync: changeStatusMutation.mutateAsync,
    isChangingStatus: changeStatusMutation.isPending,
    archive: archiveMutation.mutate,
    archiveAsync: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
    remove: deleteMutation.mutate,
    removeAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
