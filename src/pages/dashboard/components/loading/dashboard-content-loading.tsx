import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function DashboardContentLoading() {
  return (
    <>
      <div className='grid gap-10 pt-8 sm:grid-cols-1 lg:grid-cols-4'>
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
        <Skeleton className='h-32 rounded-xl' />
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <div className='col-span-1 lg:col-span-4'>
          <Skeleton className='h-96 rounded-xl' />
        </div>
        <div className='col-span-1 lg:col-span-3'>
          <Skeleton className='h-96 rounded-xl' />
        </div>
      </div>
    </>
  );
}
