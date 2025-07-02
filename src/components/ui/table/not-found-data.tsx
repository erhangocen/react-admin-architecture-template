import { IconArchiveOff } from '@tabler/icons-react'

export const NotFoundDataTable: React.FC = () => {
  return (
    <div className='rounded-md border p-1'>
      <div className='bg-white dark:bg-gray-900'>
        <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
          <div className='mx-auto max-w-screen-sm text-center'>
            <div className='flex justify-center p-3'>
              <IconArchiveOff size={96} />
            </div>
            <p className='text-md mb-4 font-bold tracking-tight text-gray-900 dark:text-white md:text-lg'>
              Veri Bulunamadı
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
