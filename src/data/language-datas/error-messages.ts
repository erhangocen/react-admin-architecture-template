import { ErrorMessagesType, LanguagePreferences } from '../language-types';

export const errorMessages: Record<LanguagePreferences, ErrorMessagesType> = {
  [LanguagePreferences.TR]: {
    required: 'Bu alan zorunludur.',
    minOneItem: 'En az bir eleman seçilmelidir.',
  },
  [LanguagePreferences.EN]: {
    required: 'This field is required.',
    minOneItem: 'At least one item must be selected.',
  },
};
