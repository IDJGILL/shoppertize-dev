"use client"

import { ChevronRightCircle, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import Box from "~/app/_components/box"
import { useCheckoutContext } from "~/lib/modules/checkout/checkout-context"

interface AddressSectionProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressSection({ ...props }: AddressSectionProps) {
  const {} = props

  const router = useRouter()

  const {
    data: { shippingAddress },
  } = useCheckoutContext()

  return (
    <>
      <Box onClick={() => router.push("/checkout/address")}>
        {shippingAddress.address1 && (
          <div className="flex cursor-pointer items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div>
                <div className="mb-1 text-sm font-semibold">
                  <span className="font-normal text-muted-foreground opacity-80">
                    Delivering order to:
                  </span>{" "}
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="line-clamp-1">{shippingAddress.address1}</div>

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
    </>
  )
}
