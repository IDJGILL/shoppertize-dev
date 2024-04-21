import Image from "next/image"
import TrustIcons from "~/assets/badges/trust/cart-trust.png"
import { cn } from "~/lib/utils/functions/ui"

export default function TrustBadges({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props

  return (
    <div className={cn(props.className)}>
      <Image src={TrustIcons} alt="" className="" />
    </div>
  )
}
