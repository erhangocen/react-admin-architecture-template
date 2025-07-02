import { Skeleton } from '../ui/skeleton';

export default function DialogFormLoading() {
  return (
    <div className='flex flex-col gap-6 py-7'>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-8 w-full' />
      </div>
    </div>
  );
}
