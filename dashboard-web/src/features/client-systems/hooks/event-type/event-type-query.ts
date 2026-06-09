'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityQuery } from '@/shared/core/hooks/use-base-entity-query';

import { EventType } from '../../types/event-type.types';
import { eventTypeService } from '../../services/event-type.service';

export function useEventTypesQuery() {
    return useBaseEntityQuery<EventType>(eventTypeService, {
        queryKey: QUERY_KEYS.eventTypes,
    });
}

