import React from 'react';
import { useCallback } from 'react';
import { toast } from '../ui/use-toast';

export const errorToast = (errorMessage: any) => {
  const toaster = useCallback(
    () =>
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem with your request. Please contact with us!',
      }),
    [errorMessage]
  );
  return toaster;
};

export function errorToast2(errorMessage: any) {
  return toast({
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description:
      'There was a problem with your request. Please contact with us!',
  });
}

export function errorToast3(
  error: Error & { response?: { data?: { error?: string; detail?: string } } }
) {
  const errorMessage = error?.response?.data;
  return toast({
    variant: 'destructive',
    title: errorMessage?.error ?? 'Uh oh! Something went wrong.',
    description:
      errorMessage?.detail ??
      'There was a problem with your request. Please contact with us!',
  });
}

export function successToast(response?: { message?: string }) {
  const responseMessage = response?.message;
  return toast({
    variant: 'success',
    title: 'Tebrilkler! İşlem başarılı.',
    description: responseMessage ?? '',
  });
}
