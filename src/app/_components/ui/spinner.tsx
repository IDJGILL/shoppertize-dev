import { cn } from '~/lib/utils/functions/ui'

interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
  width?: number
}

export default function Spinner({ ...props }: SpinnerProps) {
  return (
    <svg className='ios-spinner' width={props.width ?? 18} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'>
      <g className={cn('stroke-white', props.className)} strokeWidth='2' strokeLinecap='round'>
        <path className='opacity-100' d='M11 1v4' />
        <path className='opacity-40' d='M3.93 3.93l2.83 2.83' />
        <path className='rounded-xl opacity-60' d='M1 11h4' />
        <path className='rounded-xl opacity-60' d='M3.93 18.07l2.83-2.83' />
        <path className='rounded-xl opacity-60' d='M11 17v4' />
        <path className='rounded-xl opacity-60' d='M15.24 15.24l2.83 2.83' />
        <path className='rounded-xl opacity-60' d='M17 11h4' />
        <path className='rounded-xl opacity-60' d='M15.24 6.76l2.83-2.83' />
      </g>
    </svg>
  )
}
