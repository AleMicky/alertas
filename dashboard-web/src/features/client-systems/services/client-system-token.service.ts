import { baseService } from '@/shared/core/base.service';
import { http } from '@/lib/http';

import {
    ClientSystemToken,
    GenerateClientSystemTokenResponse,
} from '../types/client-system-token.types';
import {
    CreateClientSystemTokenDto,
    UpdateClientSystemTokenDto,
} from '../schemas/client-system-token.schema';

const endpoint = '/client-system-tokens';

export const clientSystemTokenService = {
    ...baseService<
        ClientSystemToken,
        CreateClientSystemTokenDto,
        UpdateClientSystemTokenDto
    >(endpoint),

    findByClientSystemId: async (clientSystemId: string): Promise<ClientSystemToken[]> => {
        const { data } = await http.get<ClientSystemToken[]>(
            `${endpoint}/client-system/${clientSystemId}`,
        );

        return data;
    },

    generate: async (
        clientSystemId: string,
        payload: Pick<CreateClientSystemTokenDto, 'description' | 'expiresAt'>,
    ): Promise<GenerateClientSystemTokenResponse> => {
        const { data } = await http.post<GenerateClientSystemTokenResponse>(
            `${endpoint}/client-system/${clientSystemId}/generate`,
            {
                description: payload.description || undefined,
                expiresAt: payload.expiresAt || undefined,
            },
        );

        return data;
    },

    revoke: async (tokenId: string): Promise<void> => {
        await http.delete(`${endpoint}/${tokenId}/revoke`);
    },
};
