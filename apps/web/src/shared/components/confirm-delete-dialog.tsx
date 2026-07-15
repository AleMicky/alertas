import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { buttonVariants } from '@/components/ui/button';

interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  title = '¿Eliminar registro?',
  description = 'Esta acción no se puede deshacer.',
  buttonText = 'Eliminar',
  onConfirm,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        type="button"
        className={buttonVariants({
          variant: 'destructive',
          size: 'sm',
        })}
      >
        {buttonText}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}