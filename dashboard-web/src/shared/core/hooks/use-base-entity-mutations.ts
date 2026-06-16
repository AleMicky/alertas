'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/api-response';

interface MutationService<T, TCreate, TUpdate> {
    create(data: TCreate): Promise<T>;
    update(id: string, data: TUpdate): Promise<T>;
    remove(id: string): Promise<void>;
}

interface Options {
    queryKey: string;
    entityName: string;
}

export function useBaseEntityMutations<
    T,
    TCreate,
    TUpdate,
>(
    service: MutationService<
        T,
        TCreate,
        TUpdate
    >,

    options: Options,
) {

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: service.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [options.queryKey] });
            toast.success(
                `${options.entityName} creado correctamente`,
            );
        },
        onError: (error: unknown) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    `No se pudo crear ${options.entityName.toLowerCase()}`,
                ),
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: {
            id: string;
            data: TUpdate;
        }) => service.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [options.queryKey],
            });
            toast.success(
                `${options.entityName} actualizado correctamente`,
            );
        },
        onError: (error: unknown) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    `No se pudo actualizar ${options.entityName.toLowerCase()}`,
                ),
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: service.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [options.queryKey],
            });
            toast.success(
                `${options.entityName} eliminado correctamente`,
            );
        },
        onError: (error: unknown) => {
            toast.error(
                getApiErrorMessage(
                    error,
                    `No se pudo eliminar ${options.entityName.toLowerCase()}`,
                ),
            );
        },
    });

    return {
        create: createMutation.mutate,
        createAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        update: updateMutation.mutate,
        updateAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        remove: deleteMutation.mutate,
        removeAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}