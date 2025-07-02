import { FC } from 'react'

type Props = {
  color: string
}

export const Dot: FC<Props> = ({ color }) => {
  return (
    <div
      className='h-2.5 rounded-full'
      style={{ backgroundColor: color, width: '10px' }}
    />
  )
}
