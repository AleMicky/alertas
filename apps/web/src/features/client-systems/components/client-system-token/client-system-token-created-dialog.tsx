'use client';

import { useState } from 'react';
import { Copy, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { copyToClipboard } from '@/shared/utils/clipboard';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
}

export function ClientSystemTokenCreatedDialog({
  open,
  onOpenChange,
  token,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!token) return;

    const ok = await copyToClipboard(token);

    if (!ok) {
      toast.error('No se pudo copiar el token');
      return;
    }

    setCopied(true);
    toast.success('Token copiado al portapapeles');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-amber-500" aria-hidden />
            Token generado
          </DialogTitle>
          <DialogDescription>
            Copia y guarda este valor ahora. Por seguridad no se volverá a
            mostrar en el dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bearer token
          </p>
          <code className="block break-all font-mono text-sm">{token}</code>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={handleCopy} className="gap-2">
            <Copy className="size-4" aria-hidden />
            {copied ? 'Copiado' : 'Copiar token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
