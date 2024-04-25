"use client"

import { ChevronRightCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Box from "~/app/_components/box"
import { useCartContext } from "~/vertex/components/cart/cart-context"

interface CartAddressProps extends React.HTMLAttributes<HTMLElement> {}

export default function CartAddress({ ...props }: CartAddressProps) {
  const {} = props

  const { address } = useCartContext()

  const router = useRouter()

  return (
    <Box onClick={() => router.push(`/checkout/address?aid=${address?.id}`)}>
      {address?.address.shipping.address_1 && (
        <div className="flex cursor-pointer items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div>
              <div className="mb-1 text-sm font-semibold">
                <span className="font-normal text-muted-foreground opacity-80">Delivering order to:</span>{" "}
                {address?.address.shipping.first_name} {address?.address.shipping.last_name}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="line-clamp-1">{address?.address.shipping.address_1}</div>

                <div>
                  <ChevronRightCircle className="h-4 w-4 fill-primary text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* <div
        className="px-1 py-4 text-xs font-medium text-primary"
        onClick={() => router.push("/checkout/address")}
      >
        CHANGE
      </div> */}
        </div>
      )}
    </Box>
  )
}
