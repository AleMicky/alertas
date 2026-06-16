'use client';

import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { Link2, Radio } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { FieldGroup } from '@/components/ui/field';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  FormSubmitButtons,
  TanStackForm,
  TextareaFormField,
  TextFormField,
} from '@/shared/components/form';

import {
  CreateNotificationChannelDto,
  createNotificationChannelSchema,
  defaultCreateNotificationChannel,
} from '../notification-channel.schema';
import { NotificationChannel } from '../notification-channel.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: NotificationChannel | null;
  onSubmit: (values: CreateNotificationChannelDto) => void;
  isSubmitting?: boolean;
}

export function NotificationChannelFormSheet({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const isEditing = Boolean(initialData);

  const form = useForm({
    defaultValues: defaultCreateNotificationChannel,
    validators: {
      onSubmit: createNotificationChannelSchema,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      code: initialData?.code ?? '',
      name: initialData?.name ?? '',
      webhookUrl: initialData?.webhookUrl ?? '',
      description: initialData?.description ?? '',
    });
  }, [initialData, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <SheetHeader className="shrink-0 space-y-4 border-b bg-linear-to-br from-primary/5 via-muted/30 to-background p-6">
          <Badge variant="outline" className="w-fit gap-1.5 font-normal">
            <Radio className="size-3.5" aria-hidden />
            {isEditing ? 'Edición' : 'Alta'}
          </Badge>
          <div className="space-y-1.5 pr-8">
            <SheetTitle className="text-left text-xl">
              {isEditing ? 'Editar canal' : 'Nuevo canal'}
            </SheetTitle>
            <SheetDescription className="text-left leading-relaxed">
              {isEditing
                ? 'Actualiza el destino webhook y la información del canal.'
                : 'Registra un endpoint webhook para recibir las alertas enviadas.'}
            </SheetDescription>
          </div>
        </SheetHeader>

        <TanStackForm
          form={form}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <FieldGroup>
              <form.Field name="code">
                {(field) => (
                  <TextFormField
                    field={field}
                    label="Código"
                    placeholder="TELEGRAM_OPS"
                    autoComplete="off"
                    disabled={isSubmitting || isEditing}
                    className="font-mono"
                  />
                )}
              </form.Field>

              <form.Field name="name">
                {(field) => (
                  <TextFormField
                    field={field}
                    label="Nombre"
                    placeholder="Telegram Operaciones"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>
            </FieldGroup>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                <Link2 className="size-4 text-primary" aria-hidden />
                Endpoint webhook
              </div>

              <form.Field name="webhookUrl">
                {(field) => (
                  <TextareaFormField
                    field={field}
                    label="URL del webhook"
                    placeholder="https://n8n.ejemplo.com/webhook/telegram-ops"
                    disabled={isSubmitting}
                    rows={4}
                    className="min-h-28 resize-y font-mono text-sm leading-relaxed break-all"
                    description="Pega la URL completa del webhook. Se mostrará en varias líneas para facilitar la revisión."
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {(field) => (
                <TextareaFormField
                  field={field}
                  label="Descripción"
                  placeholder="Canal para el equipo de operaciones"
                  disabled={isSubmitting}
                  rows={3}
                />
              )}
            </form.Field>
          </div>

          <SheetFooter className="shrink-0 border-t bg-background/95 p-4 backdrop-blur-sm">
            <FormSubmitButtons
              isSubmitting={isSubmitting}
              submitText={isEditing ? 'Actualizar canal' : 'Crear canal'}
              submittingText={isEditing ? 'Actualizando...' : 'Creando...'}
              onReset={() => form.reset()}
            />
          </SheetFooter>
        </TanStackForm>
      </SheetContent>
    </Sheet>
  );
}
