import React, { FC } from 'react';
import { Separator } from '@/components/ui/separator';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import DashboardContentLoading from './dashboard-content-loading';
import { DashboardSubtitleLoading } from './dashboard-subtitle-loading';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  dashboardSubtitleItems: any[];
};

export const DashboardLoading: FC<Props> = ({ dashboardSubtitleItems }) => {
  return (
    <main
      id='content'
      className={`h-full overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0`}
    >
      <Layout>
        <LayoutHeader className='fixed z-10 w-full bg-background p-0 pt-5 md:px-0'>
          <div className='flex h-full w-full flex-col justify-between gap-1 bg-background'>
            <div className='flex flex-row justify-between px-12'>
              <div className='flex flex-row items-center gap-3'>
                <Skeleton className='h-10 w-44' />
                <Separator orientation='vertical' />
                <Skeleton className='h-8 w-32' />
                <Skeleton className='h-5 w-6' />
                <Skeleton className='h-8 w-32' />
              </div>
              <div className='flex flex-row'>
                <div className='flex items-center space-x-4'>
                  <Skeleton className='flex h-9 rounded-md border px-1 py-1 md:w-[100px] lg:w-[300px]' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-3 bg-background'>
              <DashboardSubtitleLoading
                dashboardSubtitleItems={dashboardSubtitleItems}
              />
              <Separator orientation='horizontal' />
            </div>
          </div>
        </LayoutHeader>
        <LayoutBody className='w-full space-y-4 pt-[var(--header-height)]'>
          <DashboardContentLoading />
        </LayoutBody>
      </Layout>
    </main>
  );
};
