import { useLanguagePreference } from '@/hooks/use-language-preference';
import { z } from 'zod';

export const useRegisterSchema = () => {
  const { getStaticErrorMessagesForPreference } = useLanguagePreference();

  const errors = getStaticErrorMessagesForPreference();

  return z
    .object({
      email: z
        .string()
        .min(1, { message: 'Please enter your email' })
        .email({ message: 'Invalid email address' }),
      password: z
        .string()
        .min(1, {
          message: 'Please enter your password',
        })
        .min(7, {
          message: 'Password must be at least 7 characters long',
        }),
      userName: z.string(),
      confirmPassword: z.string(),
      token: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    });
};

export type RegisterRequestModel = z.infer<
  ReturnType<typeof useRegisterSchema>
>;
