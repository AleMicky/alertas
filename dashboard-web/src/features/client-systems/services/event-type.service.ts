import { http } from '@/lib/http';
import { unwrapApiResponse } from '@/lib/api-response';
import { baseService } from '@/shared/core/base.service';

import { EventType } from '../types/event-type.types';
import {
    CreateEventTypeDto,
    UpdateEventTypeDto,
} from '../schemas/event-type.shcema';

const endpoint = '/event-types';

export const eventTypeService = {
    ...baseService<
        EventType,
        CreateEventTypeDto,
        UpdateEventTypeDto
    >(endpoint),

    findActiveByClientSystemId: async (
        clientSystemId: string,
    ): Promise<EventType[]> =>
        unwrapApiResponse<EventType[]>(
            (
                await http.get(
                    `${endpoint}/client-system/${clientSystemId}/active`,
                )
            ).data,
        ),
};