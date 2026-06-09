'use client';

import { useQuery } from '@tanstack/react-query';

interface QueryService<T> {
    getAll(): Promise<T[]>;
}

interface Options {
    queryKey: string;
}

export function useBaseEntityQuery<T>(
    service: QueryService<T>,
    options: Options,
) {

    const query = useQuery({
        queryKey: [options.queryKey],
        queryFn: service.getAll,
    });

    return {
        data: query.data ?? [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}