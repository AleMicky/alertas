'use client';

import type { ReactNode } from 'react';
import { Copy, KeyRound, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StatusBadge } from '@/shared/components';
import { copyToClipboard } from '@/shared/utils/clipboard';

import { ClientSystem } from '../../types/client-system.types';
import { ClientSystemToken } from '../../types/client-system-token.types';
import {
  formatTokenDate,
  isTokenExpired,
} from './client-system-token.utils';

interface Props {
  token: ClientSystemToken | null;
  clientSystem?: ClientSystem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke: (tokenId: string) => void;
  isRevoking?: boolean;
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function ClientSystemTokenDetailSheet({
  token,
  clientSystem,
  open,
  onOpenChange,
  onRevoke,
  isRevoking = false,
}: Props) {
  const expired = token ? isTokenExpired(token.expiresAt) : false;

  const handleCopyReference = async () => {
    if (!token?.token) return;

    const ok = await copyToClipboard(token.token);

    if (!ok) {
      toast.error('No se pudo copiar');
      return;
    }

    toast.success('Referencia copiada');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {token ? (
          <>
            <SheetHeader className="space-y-4 border-b bg-gradient-to-br from-primary/5 via-muted/30 to-background p-6">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <Badge variant="outline" className="gap-1 font-mono text-xs">
                  <KeyRound className="size-3" aria-hidden />
                  Token de integración
                </Badge>
                <StatusBadge active={token.active && !expired} />
                {expired ? (
                  <Badge variant="destructive">Expirado</Badge>
                ) : null}
              </div>
              <SheetTitle className="text-left font-mono text-xl">
                {token.token}
              </SheetTitle>
              <SheetDescription className="text-left">
                El valor completo solo se muestra al generarlo. Usa la referencia
                para identificar este token en el listado.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 p-6">
              <dl className="space-y-4">
                <DetailRow label="Referencia">
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                      {token.token}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleCopyReference}
                    >
                      <Copy className="size-4" aria-hidden />
                    </Button>
                  </div>
                </DetailRow>

                <DetailRow label="Sistema">
                  {clientSystem?.name ?? '—'}
                  {clientSystem?.code ? (
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      ({clientSystem.code})
                    </span>
                  ) : null}
                </DetailRow>

                <DetailRow label="Expira">
                  {formatTokenDate(token.expiresAt)}
                </DetailRow>

                <DetailRow label="Creado">
                  {formatTokenDate(token.createdAt)}
                </DetailRow>

                <DetailRow label="Actualizado">
                  {formatTokenDate(token.updatedAt)}
                </DetailRow>

                {token.createdBy ? (
                  <DetailRow label="Creado por">
                    {token.createdBy}
                  </DetailRow>
                ) : null}
              </dl>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Uso en integraciones</p>
                <p className="text-sm text-muted-foreground">
                  Envía el token plano (<code>msa_...</code>) en el header{' '}
                  <code>Authorization: Bearer</code> para autenticar las
                  solicitudes del sistema cliente.
                </p>
              </div>

              {token.active ? (
                <>
                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-2"
                      disabled={isRevoking}
                      onClick={() => onRevoke(token.id)}
                    >
                      <ShieldOff className="size-4" aria-hidden />
                      {isRevoking ? 'Revocando…' : 'Revocar token'}
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
