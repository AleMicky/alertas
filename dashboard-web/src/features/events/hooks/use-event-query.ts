import { eventService } from "../event.service";
import { useBaseEntityQuery } from "@/shared/core/hooks/use-base-entity-query";
import { Event } from "../event.types";
import { QUERY_KEYS } from "@/shared/constants/query-keys";

export function useEventQuery() {
    return useBaseEntityQuery<Event>(
        eventService, {
        queryKey: QUERY_KEYS.events,
    });
}