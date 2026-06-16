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
  field: {
    name: string;
    state: {
      value?: string;
      meta: {
        isTouched: boolean;
        isValid: boolean;
        errors: unknown[];
      };
    };
    handleBlur: () => void;
    handleChange: (value: string) => void;
  };
  label: string;
  description?: string;
  placeholder?: string;
}

export function JsonFormField({
  field,
  label,
  description,
  placeholder,
  ...props
}: Props) {
  const isInvalid =
    field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        className="min-h-32 resize-y font-mono text-sm leading-relaxed"
        {...props}
      />

      {description ? (
        <FieldDescription>{description}</FieldDescription>
      ) : null}

      {isInvalid ? (
        <FormFieldError errors={field.state.meta.errors} />
      ) : null}
    </Field>
  );
}
