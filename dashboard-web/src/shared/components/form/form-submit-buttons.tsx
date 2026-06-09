'use client';

import { Button } from '@/components/ui/button';

interface Props {
    isSubmitting?: boolean;
    submitText?: string;
    submittingText?: string;
    resetText?: string;
    onReset?: () => void;
    disabled?: boolean;
}

export function FormSubmitButtons({
    isSubmitting,
    submitText = 'Guardar',
    submittingText = 'Guardando...',
    resetText = 'Limpiar',
    onReset,
    disabled,
}: Props) {

    return (
        <div className="flex justify-end gap-2 pt-2">
            {onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    disabled={
                        isSubmitting ||
                        disabled
                    }
                >
                    {resetText}
                </Button>
            )}
            <Button
                type="submit"
                disabled={
                    isSubmitting ||
                    disabled
                }
            >
                {isSubmitting
                    ? submittingText
                    : submitText}
            </Button>
        </div>
    );
}