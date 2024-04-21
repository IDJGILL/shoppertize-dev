import Image from "next/image"
import { cn } from "~/lib/utils/functions/ui"

interface ProductImageProps extends React.HTMLAttributes<HTMLElement> {
  sourceUrl: string
  size?: number
  link?: boolean
  lazyLoad: boolean
}

export default function ProductImage({ ...props }: ProductImageProps) {
  const { sourceUrl, size } = props

  return (
    <div
      className={cn(
        "relative aspect-[5/5] overflow-hidden bg-zinc-50",
        props.className,
      )}
    >
      <Image
        src={sourceUrl}
        alt=""
        width={size ?? 500}
        height={size ?? 500}
        className="h-full w-full object-contain mix-blend-multiply"
        priority={!props.lazyLoad}
      />
    </div>
  )
}
