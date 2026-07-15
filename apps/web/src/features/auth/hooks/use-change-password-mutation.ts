'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/api-response';
import { authStorage } from '../auth-storage';
import { authService } from '../auth.service';
import type { ChangePasswordDto } from '../auth.schema';

export function useChangePasswordMutation() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: ChangePasswordDto) =>
      authService.changePassword(payload),
    onSuccess: (response) => {
      authStorage.clearSession();
      toast.success(response.message);
      router.replace('/login');
    },
    onError: (error: unknown) => {
      toast.error(
        getApiErrorMessage(error, 'No se pudo actualizar la contraseña'),
      );
    },
  });

  return {
    changePassword: mutation.mutate,
    changePasswordAsync: mutation.mutateAsync,
    isChangingPassword: mutation.isPending,
  };
}
