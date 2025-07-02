// create-location-request-model.ts

import { useLanguagePreference } from '@/hooks/use-language-preference';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const usePassresetSchema = () => {
  const { getStaticErrorMessagesForPreference } = useLanguagePreference();

  const errors = getStaticErrorMessagesForPreference();

  return z.object({
    username: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' })
      .or(z.literal('')),
    email: z.string(),
  });
};

export type PassresetRequestModel = z.infer<
  ReturnType<typeof usePassresetSchema>
>;
