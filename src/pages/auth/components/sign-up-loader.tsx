import { Skeleton } from '@/components/ui/skeleton'

export default function SignUpLoader() {
  return (
    <div className='flex flex-col gap-5'>
      <Skeleton className='h-6 w-36' />
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-3 w-80' />
        <Skeleton className='h-3 w-80' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-5 w-16' />
        <Skeleton className='h-8 w-full' />
      </div>
      <div className='flex flex-col gap-1'>
        <Skeleton className='h-9 w-full' />
      </div>
      <div className='flex flex-col items-center justify-center gap-1'>
        <Skeleton className='h-3 w-56' />
        <Skeleton className='h-3 w-52' />
      </div>
    </div>
  )
}
