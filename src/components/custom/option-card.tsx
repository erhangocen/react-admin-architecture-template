import { Card, CardContent } from '@/components/ui/card';
import { ReactNode, MouseEvent } from 'react';
import { X } from 'lucide-react';

export type OptionCardDataType = {
  title: string;
  icon: ReactNode;
  type?: 'internet' | 'login';
  link?: string;
  onClose?: () => void;
};

export const OptionCard: React.FC<OptionCardDataType> = ({
  title,
  icon,
  onClose,
}) => {
  return (
    <Card className='motion-preset-confetti relative h-32'>
      {/* Sağ üst köşe X butonu */}
      {onClose && (
        <button
          onClick={(e: MouseEvent) => {
            e.stopPropagation(); // Tıklama olayının yayılmasını durdurur
            onClose();
          }}
          className='absolute right-2 top-2 p-1 text-slate-500 hover:text-slate-700'
          aria-label='Close'
        >
          <X size={16} />
        </button>
      )}
      <CardContent className='flex h-full w-full flex-col items-center justify-between gap-y-2 p-4 pt-6'>
        <div>{icon}</div>
        <div className='truncate text-xs text-muted-foreground'>{title}</div>
      </CardContent>
    </Card>
  );
};
