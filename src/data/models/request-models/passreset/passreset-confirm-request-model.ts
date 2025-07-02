// create-location-request-model.ts

import { useLanguagePreference } from '@/hooks/use-language-preference';
import { z } from 'zod';

export const usePassresetConfirmSchema = () => {
  const { getStaticErrorMessagesForPreference } = useLanguagePreference();

  const errors = getStaticErrorMessagesForPreference();

  return z
    .object({
      username: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      token: z.string().optional(),
      newPassword: z.string().min(7, {
        message: 'Password must be at least 7 characters long',
      }),
      confirmPassword: z.string().min(7, {
        message: 'Password must be at least 7 characters long',
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    });
};

export type PassresetConfirmRequestModel = z.infer<
  ReturnType<typeof usePassresetConfirmSchema>
>;
