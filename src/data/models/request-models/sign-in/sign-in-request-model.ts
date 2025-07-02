import { useLanguagePreference } from '@/hooks/use-language-preference';
import { z } from 'zod';

export const useSignInSchema = () => {
  const { getStaticErrorMessagesForPreference } = useLanguagePreference();

  const errors = getStaticErrorMessagesForPreference();

  return z.object({
    userName: z.string().min(1, { message: 'Required Field' }),
    // .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(7, {
        message: 'Password must be at least 7 characters long',
      }),
  });
};

export type SignInRequestModel = z.infer<ReturnType<typeof useSignInSchema>>;
