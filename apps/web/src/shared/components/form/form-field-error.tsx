import { FieldError } from '@/components/ui/field';

interface Props {
    errors: unknown[];
}

export function FormFieldError({ errors }: Props) {
    
    if (!errors.length) {
        return null;
    }

    return (
        <FieldError errors={errors as { message?: string | undefined }[]} />
    );
}