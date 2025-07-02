import { Skeleton } from '@/components/ui/skeleton';
import { useCustomer } from '../../pages/customer/hooks/use-customer';
import { FC } from 'react';

type Props = {
  dashboardSubtitleItems: any[];
};

export const DashboardSubtitleLoading: FC<Props> = ({
  dashboardSubtitleItems,
}) => {
  return (
    <div className='flex flex-row justify-center gap-20'>
      {dashboardSubtitleItems.map((item, index) => (
        <Skeleton key={index} className='h-4 w-28' />
      ))}
    </div>
  );
};
