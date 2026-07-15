'use client';

import { ComponentProps } from 'react';

import { Textarea } from '@/components/ui/textarea';
import {
    Field,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';

import { FormFieldError } from './form-field-error';

interface Props
    extends Omit<
        ComponentProps<typeof Textarea>,
        'value' | 'onChange' | 'onBlur' | 'name'
    > {
    field: any;
    label: string;
    description?: string;
}

export function TextareaFormField({
    field,
    label,
    description,
    ...props
}: Props) {
    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>
                {label}
            </FieldLabel>

            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) =>
                    field.handleChange(e.target.value)
                }
                aria-invalid={isInvalid}
                {...props}
            />

            {description && (
                <FieldDescription>
                    {description}
                </FieldDescription>
            )}

            {isInvalid && (
                <FormFieldError
                    errors={field.state.meta.errors}
                />
            )}
        </Field>
    );
}