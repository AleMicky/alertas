'use client';

import { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import {
    Field,
    FieldLabel,
} from '@/components/ui/field';

import { FormFieldError } from './form-field-error';

interface Props
    extends Omit<
        ComponentProps<typeof Input>,
        'value' | 'onChange' | 'onBlur' | 'name' | 'type'
    > {
    field: any;
    label: string;
}

export function NumberFormField({
    field,
    label,
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

            <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) =>
                    field.handleChange(
                        e.target.value === ''
                            ? undefined
                            : Number(e.target.value),
                    )
                }
                aria-invalid={isInvalid}
                {...props}
            />

            {isInvalid && (
                <FormFieldError
                    errors={field.state.meta.errors}
                />
            )}
        </Field>
    );
}