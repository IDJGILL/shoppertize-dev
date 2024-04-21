import Image from "next/image"
import Fedex from "~/assets/badges/shipping/fedex.png"
import DTDC from "~/assets/badges/shipping/dtdc.png"
import Delhivery from "~/assets/badges/shipping/delhivery.png"
import Ecom from "~/assets/badges/shipping/ecom.png"
import Express from "~/assets/badges/shipping/express.png"
import { cn } from "~/lib/utils/functions/ui"

export default function ShippingBadges({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        props.className,
      )}
    >
      <Image
        src={Fedex}
        alt="Fedex"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />

      <Image
        src={DTDC}
        alt="DTDC"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />

      <Image
        src={Delhivery}
        alt="Delhivery"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />

      <Image
        src={Ecom}
        alt="Ecom"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />

      <Image
        src={Express}
        alt="Express"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />
    </div>
  )
}
