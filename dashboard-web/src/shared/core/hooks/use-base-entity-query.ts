'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

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
    const { status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const shouldFetch = (options.enabled ?? true) && isAuthenticated;

    const query = useQuery({
        queryKey: [options.queryKey],
        queryFn: service.getAll,
        enabled: shouldFetch,
    });

    const isLoading =
        status === 'loading'
        || (shouldFetch && query.isPending);

    return {
        data: query.data ?? [],
        isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
    };
}
