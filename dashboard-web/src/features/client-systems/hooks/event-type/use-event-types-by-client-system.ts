'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { eventTypeService } from '../../services/event-type.service';

export function useEventTypesByClientSystem(
    clientSystemId?: string,
) {
    return useQuery({
        queryKey: [
            QUERY_KEYS.eventTypes,
            'client-system',
            clientSystemId,
        ],
        queryFn: () =>
            eventTypeService.findActiveByClientSystemId(
                clientSystemId!,
            ),
        enabled: !!clientSystemId,
    });
}