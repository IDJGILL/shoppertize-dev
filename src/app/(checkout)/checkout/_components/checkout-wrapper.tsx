import { type ReactNode } from "react"

interface CheckoutWrapperProps extends React.HTMLAttributes<HTMLElement> {
  left: ReactNode
  right: ReactNode
}

export default function CheckoutWrapper({ ...props }: CheckoutWrapperProps) {
  return (
    <div className="container md:flex">
      <div className="mb-2 py-5 md:min-h-screen md:w-[60%] md:border-r md:py-8 md:pr-8">
        {props.left}
      </div>

      <div className="md:w-[40%] md:py-8 md:pl-8">{props.right}</div>
    </div>
  )
}
