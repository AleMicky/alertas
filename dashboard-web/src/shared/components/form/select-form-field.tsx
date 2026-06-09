'use client';

import { ComponentProps } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';

interface Option {
    label: string;
    value: string;
}

interface Props
    extends Omit<
        ComponentProps<typeof Select>,
        'value' | 'onValueChange'
    > {

    field: any;

    label: string;

    options: Option[];

    placeholder?: string;

    description?: string;
}

export function SelectFormField({
    field,
    label,
    options,
    placeholder = 'Seleccionar',
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
            <Select
                value={field.state.value ?? ''}
                onValueChange={
                    field.handleChange
                }
                {...props}
            >
                <SelectTrigger
                    id={field.name}
                    aria-invalid={isInvalid}
                >
                    <SelectValue
                        placeholder={placeholder}
                    />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}

                </SelectContent>
            </Select>
            {description && (
                <FieldDescription>
                    {description}
                </FieldDescription>
            )}
            {isInvalid && (
                <FieldError
                    errors={
                        field.state.meta.errors
                    }
                />
            )}
        </Field>
    );
}