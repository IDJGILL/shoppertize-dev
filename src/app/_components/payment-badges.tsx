import { cn } from "~/lib/utils/functions/ui"
import Visa from "~/assets/badges/payment/visa-badge.png"
import MasterCard from "~/assets/badges/payment/mastercard-badge.png"
import GooglePay from "~/assets/badges/payment/gpay-badge.png"
import Bhim from "~/assets/badges/payment/bhim-badge.png"
import PhonePe from "~/assets/badges/payment/phonepe-badge.png"
import Image from "next/image"

export default function PaymentBadges({
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
        src={Visa}
        alt="Visa"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />
      <Image
        src={MasterCard}
        alt="MasterCard"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />
      <Image
        src={GooglePay}
        alt="GooglePay"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />
      <Image
        src={Bhim}
        alt="Bhim"
        sizes="100vw"
        className="h-auto w-full max-w-[70px]"
      />
      <Image
        src={PhonePe}
        alt="PhonePe"
        sizes="100vw"
        className="h-auto w-full max-w-[90px]"
      />
    </div>
  )
}
