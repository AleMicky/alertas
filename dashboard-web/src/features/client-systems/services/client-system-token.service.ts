import { baseService } from '@/shared/core/base.service';
import { http } from '@/lib/http';

import { ClientSystemToken } from '../types/client-system-token.types';
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

    findByToken: async (token: string): Promise<ClientSystemToken> => {
        const { data } = await http.get(`${endpoint}/token/${token}`);
        return data;
    },

    findByClientSystemId: async (clientSystemId: string): Promise<ClientSystemToken[]> => {

        const { data } = await http.get<ClientSystemToken[]>(
            `${endpoint}/client-system/${clientSystemId}`,
        );

        return data;

    },
};