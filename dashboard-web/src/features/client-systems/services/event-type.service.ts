import { http } from '@/lib/http';
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
    ): Promise<EventType[]> => {
        const { data } = await http.get<EventType[]>(
            `${endpoint}/client-system/${clientSystemId}/active`,
        );

        return data;
    },
};