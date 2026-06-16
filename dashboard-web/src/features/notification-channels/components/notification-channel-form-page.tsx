'use client';

import Link from 'next/link';
import { ArrowLeft, Radio } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CreateNotificationChannelDto } from '../notification-channel.schema';
import { NotificationChannel } from '../notification-channel.types';
import { NotificationChannelForm } from './notification-channel-form';

interface Props {
  initialData?: NotificationChannel | null;
  isSubmitting?: boolean;
  onSubmit: (values: CreateNotificationChannelDto) => void;
}

export function NotificationChannelFormPage({
  initialData,
  isSubmitting,
  onSubmit,
}: Props) {
  const isEditing = Boolean(initialData);

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="-ml-2 gap-2"
        render={<Link href="/notification-channels" />}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a canales
      </Button>

      <Card className="border-muted/60 shadow-sm">
        <CardHeader className="space-y-4 border-b bg-linear-to-br from-primary/5 via-muted/30 to-background">
          <Badge variant="outline" className="w-fit gap-1.5 font-normal">
            <Radio className="size-3.5" aria-hidden />
            {isEditing ? 'Edición' : 'Alta'}
          </Badge>
          <div className="space-y-1.5">
            <CardTitle className="text-xl">
              {isEditing ? 'Editar canal' : 'Nuevo canal'}
            </CardTitle>
            <CardDescription className="leading-relaxed">
              {isEditing
                ? 'Actualiza el destino webhook y la información del canal.'
                : 'Registra un endpoint webhook para recibir las alertas enviadas.'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <NotificationChannelForm
            initialData={initialData}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </main>
  );
}
