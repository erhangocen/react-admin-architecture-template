import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const numericFieldValue = (data?: number | null) => {
  const value = data?.toString();
  if (!value) return '0';
  if (value.length === 1 && value === '0') return value;
  if (value.length > 0 && value != '0') return value.replace(/^0+/, '');
};
