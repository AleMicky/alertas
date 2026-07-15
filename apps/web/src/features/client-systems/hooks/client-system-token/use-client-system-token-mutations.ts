'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants/query-keys';

import { GenerateClientSystemTokenDto } from '../../schemas/client-system-token.schema';
import { clientSystemTokenService } from '../../services/client-system-token.service';
import { GenerateClientSystemTokenResponse } from '../../types/client-system-token.types';

export function useClientSystemTokenMutations() {
    const queryClient = useQueryClient();

    const generateMutation = useMutation({
        mutationFn: ({
            clientSystemId,
            data,
        }: {
            clientSystemId: string;
            data: GenerateClientSystemTokenDto;
        }) => clientSystemTokenService.generate(clientSystemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.clientSystemTokens],
            });
            toast.success('Token generado correctamente');
        },
        onError: () => {
            toast.error('No se pudo generar el token');
        },
    });

    const revokeMutation = useMutation({
        mutationFn: (tokenId: string) => clientSystemTokenService.revoke(tokenId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.clientSystemTokens],
            });
            toast.success('Token revocado');
        },
        onError: () => {
            toast.error('No se pudo revocar el token');
        },
    });

    return {
        generate: generateMutation.mutate,
        generateAsync: generateMutation.mutateAsync,
        isGenerating: generateMutation.isPending,
        revoke: revokeMutation.mutate,
        revokeAsync: revokeMutation.mutateAsync,
        isRevoking: revokeMutation.isPending,
    };
}

export type { GenerateClientSystemTokenResponse };
