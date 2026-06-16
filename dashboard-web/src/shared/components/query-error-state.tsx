'use client';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api-response';

interface Props {
    title?: string;
    error: unknown;
    onRetry?: () => void;
}

function getErrorMessage(error: unknown) {
    return getApiErrorMessage(error, 'No se pudo cargar la información.');
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
