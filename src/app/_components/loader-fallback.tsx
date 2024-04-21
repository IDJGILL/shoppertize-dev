import Image from "next/image"
import ShoppertizeIcon from "~/assets/brand/shoppertize-icon.svg"
import { cn } from "~/lib/utils/functions/ui"

interface LoaderFallBackProps extends React.HTMLAttributes<HTMLElement> {}

export default function LoaderFallBack({ ...props }: LoaderFallBackProps) {
  const {} = props

  return (
    <div
      className={cn(
        "z-[1000] flex h-[100dvh] items-center justify-center",
        props.className,
      )}
    >
      <div className="relative flex aspect-square h-12 w-12 max-w-max items-center justify-center rounded-full border bg-white">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"></span>

        <Image
          src={ShoppertizeIcon as string}
          alt=""
          width={24}
          height={24}
          className="ml-1 animate-pulse"
          priority
        />
      </div>
    </div>
  )
}
