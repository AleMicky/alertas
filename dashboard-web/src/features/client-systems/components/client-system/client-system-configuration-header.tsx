'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatusBadge } from '@/shared/components';

import { ClientSystem } from '../../types/client-system.types';

interface Props {
  clientSystem?: ClientSystem;
}

export function ClientSystemConfigurationHeader({ clientSystem }: Props) {
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="-ml-2 gap-2"
        render={<Link href="/client-systems" />}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a sistemas
      </Button>

      {clientSystem ? (
        <Card className="border-muted/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl">{clientSystem.name}</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                {clientSystem.code}
              </Badge>
              <StatusBadge active={clientSystem.active} />
            </div>
            {clientSystem.description ? (
              <CardDescription>{clientSystem.description}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configura tipos de evento y tokens de integración para este sistema.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
