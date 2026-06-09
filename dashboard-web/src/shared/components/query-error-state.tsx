'use client';

import axios from 'axios';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
    title?: string;
    error: unknown;
    onRetry?: () => void;
}

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string | string[] } | undefined;
        const message = data?.message;

        if (Array.isArray(message)) {
            return message.join(', ');
        }

        if (typeof message === 'string') {
            return message;
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'No se pudo cargar la información.';
}

export function QueryErrorState({
    title = 'Error al cargar datos',
    error,
    onRetry,
}: Props) {
    return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <h3 className="font-medium text-destructive">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                {getErrorMessage(error)}
            </p>

            {onRetry ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => onRetry()}
                >
                    <RefreshCw className="size-4" />
                    Reintentar
                </Button>
            ) : null}
        </div>
    );
}
