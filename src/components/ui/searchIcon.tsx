import { cn } from '@/lib/utils';

export default function SearchIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 start-0 flex w-10 items-center ps-3',
        className
      )}
    >
      <svg
        className='h-5 w-5 text-gray-500 dark:text-gray-400'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 20 20'
      >
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
        />
      </svg>
    </div>
  );
}
