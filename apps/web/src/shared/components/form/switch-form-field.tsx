'use client';

import { ComponentProps } from 'react';

import { Switch } from '@/components/ui/switch';
import {
    Field,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';

interface Props
    extends Omit<
        ComponentProps<typeof Switch>,
        'checked' | 'onCheckedChange' | 'name'
    > {
    field: any;
    label: string;
    description?: string;
}

export function SwitchFormField({
    field,
    label,
    description,
    ...props
}: Props) {
    return (
        <Field orientation="horizontal">
            <div className="space-y-1">
                <FieldLabel htmlFor={field.name}>
                    {label}
                </FieldLabel>

                {description && (
                    <FieldDescription>
                        {description}
                    </FieldDescription>
                )}
            </div>

            <Switch
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                {...props}
            />
        </Field>
    );
}