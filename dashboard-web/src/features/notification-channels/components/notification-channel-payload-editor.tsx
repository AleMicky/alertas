'use client';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldError } from '@/shared/components/form/form-field-error';
import { formatJsonObject } from '@/shared/utils/json-object';

import {
  parsePayloadExampleText,
  syncPayloadRequiredKeys,
  updatePayloadExampleField,
  valueToEditableString,
} from '../notification-channel-payload.utils';

interface FieldApi<T> {
  name: string;
  state: {
    value: T;
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors: unknown[];
    };
  };
  handleBlur: () => void;
  handleChange: (value: T) => void;
}

interface Props {
  payloadExampleField: FieldApi<string | undefined>;
  payloadRequiredField: FieldApi<Record<string, boolean> | undefined>;
  isSubmitting?: boolean;
}

export function NotificationChannelPayloadEditor({
  payloadExampleField,
  payloadRequiredField,
  isSubmitting,
}: Props) {
  const payloadExampleText = payloadExampleField.state.value ?? '';
  const payloadRequired = payloadRequiredField.state.value ?? {};
  const parsedPayload = parsePayloadExampleText(payloadExampleText);
  const payloadKeys = parsedPayload ? Object.keys(parsedPayload) : [];
  const hasInvalidJson = Boolean(payloadExampleText.trim()) && !parsedPayload;

  const isExampleInvalid =
    payloadExampleField.state.meta.isTouched &&
    !payloadExampleField.state.meta.isValid;

  const handleExampleTextChange = (nextText: string) => {
    payloadExampleField.handleChange(nextText);

    const parsed = parsePayloadExampleText(nextText);

    if (!parsed) {
      return;
    }

    payloadRequiredField.handleChange(
      syncPayloadRequiredKeys(payloadRequired, Object.keys(parsed)),
    );
  };

  const handleFieldValueChange = (key: string, nextValue: string) => {
    handleExampleTextChange(
      updatePayloadExampleField(payloadExampleText, key, nextValue),
    );
  };

  const handleRequiredChange = (key: string, checked: boolean) => {
    payloadRequiredField.handleChange({
      ...payloadRequired,
      [key]: checked,
    });
  };

  return (
    <div className="space-y-4">
      <Field data-invalid={isExampleInvalid || hasInvalidJson}>
        <FieldLabel htmlFor="payloadExampleText">
          Body del webhook (JSON)
        </FieldLabel>
        <Textarea
          id="payloadExampleText"
          value={payloadExampleText}
          onBlur={payloadExampleField.handleBlur}
          onChange={(event) => handleExampleTextChange(event.target.value)}
          placeholder={`{\n  "chat_id": "-1001234567890",\n  "text": "Alerta crítica"\n}`}
          disabled={isSubmitting}
          rows={10}
          className="min-h-40 resize-y font-mono text-sm leading-relaxed"
        />
        <FieldDescription>
          Pega el JSON del body (email, Telegram, etc.). Los campos se
          detectan automáticamente para editarlos abajo.
        </FieldDescription>
        {hasInvalidJson ? (
          <p className="text-sm text-destructive">
            El JSON debe ser un objeto válido.
          </p>
        ) : null}
        {isExampleInvalid && !hasInvalidJson ? (
          <FormFieldError errors={payloadExampleField.state.meta.errors} />
        ) : null}
      </Field>

      {parsedPayload && payloadKeys.length > 0 ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Campos detectados</p>
            <p className="text-sm text-muted-foreground">
              Edita los valores en tiempo real y marca cuáles son obligatorios.
              Al guardar se enviará{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                payloadSchemaJson
              </code>{' '}
              con{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                required
              </code>
              .
            </p>
          </div>

          {payloadKeys.map((key) => {
            const value = parsedPayload[key];
            const isComplex =
              Array.isArray(value) ||
              (typeof value === 'object' && value !== null);

            return (
              <div
                key={key}
                className="rounded-lg border bg-background/80 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <FieldLabel htmlFor={`payload-field-${key}`}>
                    {key}
                  </FieldLabel>

                  <Field
                    orientation="horizontal"
                    className="w-auto shrink-0 items-center gap-2"
                  >
                    <FieldLabel
                      htmlFor={`payload-required-${key}`}
                      className="text-xs font-normal text-muted-foreground"
                    >
                      Requerido
                    </FieldLabel>
                    <Switch
                      id={`payload-required-${key}`}
                      checked={Boolean(payloadRequired[key])}
                      onCheckedChange={(checked) =>
                        handleRequiredChange(key, checked)
                      }
                      disabled={isSubmitting}
                    />
                  </Field>
                </div>

                {isComplex ? (
                  <Textarea
                    id={`payload-field-${key}`}
                    value={valueToEditableString(value)}
                    onChange={(event) =>
                      handleFieldValueChange(key, event.target.value)
                    }
                    disabled={isSubmitting}
                    rows={4}
                    className="min-h-24 resize-y font-mono text-sm leading-relaxed"
                  />
                ) : (
                  <Input
                    id={`payload-field-${key}`}
                    value={valueToEditableString(value)}
                    onChange={(event) =>
                      handleFieldValueChange(key, event.target.value)
                    }
                    disabled={isSubmitting}
                    className="font-mono text-sm"
                  />
                )}
              </div>
            );
          })}

          <div className="rounded-lg border border-dashed bg-muted/20 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Vista previa al guardar
            </p>
            <pre className="overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {formatJsonObject({
                body: parsedPayload,
                payloadSchemaJson: buildPreviewSchema(payloadRequired),
              })}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildPreviewSchema(required: Record<string, boolean>) {
  const keys = Object.entries(required)
    .filter(([, isRequired]) => isRequired)
    .map(([key]) => key);

  if (keys.length === 0) {
    return undefined;
  }

  return { required: keys };
}
