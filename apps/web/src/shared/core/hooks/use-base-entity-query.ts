'use client';

import { useQuery } from '@tanstack/react-query';

interface QueryService<T> {
    getAll(): Promise<T[]>;
}

interface Options {
    queryKey: string;
    enabled?: boolean;
}

export function useBaseEntityQuery<T>(
    service: QueryService<T>,
    options: Options,
) {
    const shouldFetch = options.enabled ?? true;

    const query = useQuery({
        queryKey: [options.queryKey],
        queryFn: service.getAll,
        enabled: shouldFetch,
    });

    return {
        data: query.data ?? [],
        isLoading: shouldFetch && query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
    };
}
