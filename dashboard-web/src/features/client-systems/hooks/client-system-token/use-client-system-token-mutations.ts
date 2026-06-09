'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';

import {
    CreateClientSystemTokenDto,
    UpdateClientSystemTokenDto,
} from '../../schemas/client-system-token.schema';
import { clientSystemTokenService } from '../../services/client-system-token.service';
import {
    ClientSystemToken,
    GenerateClientSystemTokenResponse,
} from '../../types/client-system-token.types';

export function useClientSystemTokenMutations() {
    const queryClient = useQueryClient();

    const baseMutations = useBaseEntityMutations<
        ClientSystemToken,
        CreateClientSystemTokenDto,
        UpdateClientSystemTokenDto
    >(clientSystemTokenService, {
        queryKey: QUERY_KEYS.clientSystemTokens,
        entityName: 'Token de sistema cliente',
    });

    const generateMutation = useMutation({
        mutationFn: ({
            clientSystemId,
            data,
        }: {
            clientSystemId: string;
            data: Pick<CreateClientSystemTokenDto, 'description' | 'expiresAt'>;
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
        ...baseMutations,
        generate: generateMutation.mutate,
        generateAsync: generateMutation.mutateAsync,
        isGenerating: generateMutation.isPending,
        revoke: revokeMutation.mutate,
        revokeAsync: revokeMutation.mutateAsync,
        isRevoking: revokeMutation.isPending,
    };
}

export type { GenerateClientSystemTokenResponse };
