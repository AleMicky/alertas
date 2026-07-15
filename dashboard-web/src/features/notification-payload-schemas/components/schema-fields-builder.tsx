'use client';

import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import {
  SchemaBuilderState,
  SchemaFieldDefinition,
  SchemaFieldFormat,
  SchemaFieldPrimitiveType,
  SchemaFieldType,
  createEmptySchemaField,
} from '../notification-payload-schema.utils';

const FIELD_TYPE_OPTIONS: { label: string; value: SchemaFieldType }[] = [
  { label: 'Texto', value: 'string' },
  { label: 'Número', value: 'number' },
  { label: 'Entero', value: 'integer' },
  { label: 'Sí / No', value: 'boolean' },
  { label: 'Lista', value: 'array' },
  { label: 'Objeto', value: 'object' },
];

const ITEM_TYPE_OPTIONS: {
  label: string;
  value: SchemaFieldPrimitiveType;
}[] = [
  { label: 'Texto', value: 'string' },
  { label: 'Número', value: 'number' },
  { label: 'Entero', value: 'integer' },
  { label: 'Sí / No', value: 'boolean' },
  { label: 'Objeto', value: 'object' },
];

const FORMAT_OPTIONS: { label: string; value: SchemaFieldFormat }[] = [
  { label: 'Sin formato', value: '' },
  { label: 'Email', value: 'email' },
  { label: 'Fecha y hora', value: 'date-time' },
  { label: 'Fecha', value: 'date' },
  { label: 'URL', value: 'uri' },
  { label: 'UUID', value: 'uuid' },
];

const FIELD_TYPE_LABELS: Record<SchemaFieldType, string> = {
  string: 'Texto',
  number: 'Número',
  integer: 'Entero',
  boolean: 'Sí / No',
  array: 'Lista',
  object: 'Objeto',
};

interface Props {
  value: SchemaBuilderState;
  onChange: (value: SchemaBuilderState) => void;
  disabled?: boolean;
  error?: string;
}

export function SchemaFieldsBuilder({
  value,
  onChange,
  disabled,
  error,
}: Props) {
  const updateField = (
    id: string,
    patch: Partial<SchemaFieldDefinition>,
  ) => {
    onChange({
      ...value,
      fields: value.fields.map((field) =>
        field.id === id ? { ...field, ...patch } : field,
      ),
    });
  };

  const removeField = (id: string) => {
    onChange({
      ...value,
      fields: value.fields.filter((field) => field.id !== id),
    });
  };

  const addField = () => {
    onChange({
      ...value,
      fields: [
        ...value.fields,
        createEmptySchemaField({ required: false, format: '' }),
      ],
    });
  };

  const duplicateNames = new Set(
    value.fields
      .map((field) => field.name.trim())
      .filter(Boolean)
      .filter((name, index, names) => names.indexOf(name) !== index),
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {value.fields.length === 0 ? (
          <div className="rounded-md border border-dashed border-border/60 px-3 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              Aún no hay campos. Agrega el primero para definir el payload.
            </p>
          </div>
        ) : (
          value.fields.map((field, index) => {
            const nameInvalid =
              !field.name.trim() || duplicateNames.has(field.name.trim());
            const showFormat =
              field.type === 'string' ||
              (field.type === 'array' && field.itemsType === 'string');

            return (
              <div
                key={field.id}
                className={cn(
                  'space-y-2.5 rounded-md border border-border/60 bg-muted/10 p-3',
                  nameInvalid && 'border-destructive/40',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Campo {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                    disabled={disabled || value.fields.length <= 1}
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="size-3" />
                    Quitar
                  </Button>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-[1fr_140px]">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`${field.id}-name`}
                      className="text-[11px] text-muted-foreground"
                    >
                      Nombre del campo
                    </Label>
                    <Input
                      id={`${field.id}-name`}
                      value={field.name}
                      disabled={disabled}
                      placeholder="ej. subject"
                      autoComplete="off"
                      aria-invalid={nameInvalid}
                      className="h-8 font-mono text-xs"
                      onChange={(event) =>
                        updateField(field.id, {
                          name: event.target.value.replace(/\s+/g, ''),
                        })
                      }
                    />
                    {duplicateNames.has(field.name.trim()) ? (
                      <p className="text-[11px] text-destructive">
                        Este nombre ya está en uso.
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor={`${field.id}-type`}
                      className="text-[11px] text-muted-foreground"
                    >
                      Tipo
                    </Label>
                    <Select
                      value={field.type}
                      disabled={disabled}
                      onValueChange={(nextType) => {
                        if (!nextType) {
                          return;
                        }

                        updateField(field.id, {
                          type: nextType as SchemaFieldType,
                          format:
                            nextType === 'string' || nextType === 'array'
                              ? field.format
                              : '',
                        });
                      }}
                    >
                      <SelectTrigger
                        id={`${field.id}-type`}
                        className="h-8 w-full"
                      >
                        <SelectValue>
                          {FIELD_TYPE_LABELS[field.type]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {field.type === 'array' ? (
                  <div className="space-y-1 sm:max-w-[180px]">
                    <Label
                      htmlFor={`${field.id}-items`}
                      className="text-[11px] text-muted-foreground"
                    >
                      Tipo de cada ítem
                    </Label>
                    <Select
                      value={field.itemsType}
                      disabled={disabled}
                      onValueChange={(nextType) => {
                        if (!nextType) {
                          return;
                        }

                        updateField(field.id, {
                          itemsType: nextType as SchemaFieldPrimitiveType,
                          format:
                            nextType === 'string' ? field.format : '',
                        });
                      }}
                    >
                      <SelectTrigger
                        id={`${field.id}-items`}
                        className="h-8 w-full"
                      >
                        <SelectValue>
                          {
                            ITEM_TYPE_OPTIONS.find(
                              (option) => option.value === field.itemsType,
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {ITEM_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                {showFormat ? (
                  <div className="space-y-1 sm:max-w-[200px]">
                    <Label
                      htmlFor={`${field.id}-format`}
                      className="text-[11px] text-muted-foreground"
                    >
                      Formato
                    </Label>
                    <Select
                      value={field.format || 'none'}
                      disabled={disabled}
                      onValueChange={(nextFormat) => {
                        if (!nextFormat) {
                          return;
                        }

                        updateField(field.id, {
                          format:
                            nextFormat === 'none'
                              ? ''
                              : (nextFormat as SchemaFieldFormat),
                        });
                      }}
                    >
                      <SelectTrigger
                        id={`${field.id}-format`}
                        className="h-8 w-full"
                      >
                        <SelectValue>
                          {
                            FORMAT_OPTIONS.find(
                              (option) => option.value === field.format,
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {FORMAT_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value || 'none'}
                            value={option.value || 'none'}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-1">
                  <Label
                    htmlFor={`${field.id}-description`}
                    className="text-[11px] text-muted-foreground"
                  >
                    Descripción (opcional)
                  </Label>
                  <Input
                    id={`${field.id}-description`}
                    value={field.description}
                    disabled={disabled}
                    placeholder="Para qué sirve este campo"
                    autoComplete="off"
                    className="h-8 text-sm"
                    onChange={(event) =>
                      updateField(field.id, {
                        description: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/60 px-2.5 py-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">
                      Obligatorio
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Debe enviarse en cada notificación.
                    </p>
                  </div>
                  <Switch
                    checked={field.required}
                    disabled={disabled}
                    size="sm"
                    onCheckedChange={(checked) =>
                      updateField(field.id, { required: checked })
                    }
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          disabled={disabled}
          onClick={addField}
        >
          <Plus className="size-3" />
          Agregar campo
        </Button>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="additional-properties"
            className="text-[11px] font-normal text-muted-foreground"
          >
            Permitir campos extra
          </Label>
          <Switch
            id="additional-properties"
            checked={value.additionalProperties}
            disabled={disabled}
            size="sm"
            onCheckedChange={(checked) =>
              onChange({ ...value, additionalProperties: checked })
            }
          />
        </div>
      </div>

      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  );
}
