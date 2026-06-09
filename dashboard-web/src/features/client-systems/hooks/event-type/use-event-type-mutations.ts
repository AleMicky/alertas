'use client';

import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useBaseEntityMutations } from '@/shared/core/hooks/use-base-entity-mutations';
import { EventType } from '../../types/event-type.types';
import { eventTypeService } from '../../services/event-type.service';
import { CreateEventTypeDto, UpdateEventTypeDto } from '../../schemas/event-type.shcema';


export function useEventTypeMutations() {
    return useBaseEntityMutations<
        EventType,
        CreateEventTypeDto,
        UpdateEventTypeDto
    >(eventTypeService, {
        queryKey: QUERY_KEYS.eventTypes,
        entityName: 'Tipo de evento',
    });
}