import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';

import {
    ClientSystemToken,
    GenerateClientSystemTokenResponse,
} from '../types/client-system-token.types';
import { GenerateClientSystemTokenDto } from '../schemas/client-system-token.schema';

const endpoint = '/client-systems';

export const clientSystemTokenService = {
    findByClientSystemId: async (
        clientSystemId: string,
    ): Promise<ClientSystemToken[]> =>
        unwrapApiResponse<ClientSystemToken[]>(
            (
                await http.get(
                    `${endpoint}/${clientSystemId}/tokens`,
                )
            ).data,
        ),

    generate: async (
        clientSystemId: string,
        payload: GenerateClientSystemTokenDto,
    ): Promise<GenerateClientSystemTokenResponse> =>
        unwrapApiResponse<GenerateClientSystemTokenResponse>(
            (
                await http.post(
                    `${endpoint}/${clientSystemId}/generate-token`,
                    {
                        expiresAt: payload.expiresAt || undefined,
                    },
                )
            ).data,
        ),

    revoke: async (tokenId: string): Promise<void> => {
        unwrapApiResponse<void>(
            (await http.delete(`${endpoint}/${tokenId}/revoke`)).data,
        );
    },
};
