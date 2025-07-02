import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

interface EllipsisTextProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  maxLength: number
}

const EllipsisText: React.FC<EllipsisTextProps> = ({
  value,
  maxLength,
  ...props
}) => {
  const shouldTruncate = value.length > maxLength
  const displayValue = shouldTruncate
    ? `${value.substring(0, maxLength - 3)}...`
    : value

  return (
    <div {...props}>
      {shouldTruncate ? (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>{displayValue}</div>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='flex items-center gap-4'>
              {value}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        // <div className='group relative'>
        //   {displayValue}
        //   <div className='absolute hidden rounded bg-gray-700 p-2 text-sm text-white shadow-lg group-hover:block'>
        //     {value}
        //   </div>
        // </div>
        value
      )}
    </div>
  )
}

export default EllipsisText
