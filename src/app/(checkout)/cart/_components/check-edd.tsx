"use client"

import Box from "~/app/_components/box"
import { Truck } from "lucide-react"
import { useCartContext } from "~/vertex/components/cart/cart/context"
// import { useState } from "react"
// import { Button } from "~/app/_components/ui/button"
// import { ModelXDrawer } from "~/app/_components/ui/dialog"
// import { Input } from "~/app/_components/ui/input"

interface CheckEddProps extends React.HTMLAttributes<HTMLElement> {}

export default function CheckEdd({ ...props }: CheckEddProps) {
  const {} = props

  return (
    <Box>
      <ShowEddSection />
      {/* <CheckEddSection /> */}
    </Box>
  )
}

// interface CheckEddSectionProps extends React.HTMLAttributes<HTMLElement> {}

// function CheckEddSection({ ...props }: CheckEddSectionProps) {
//   const {} = props
//   const [open, openSet] = useState(false)

//   const {
//     cartData: { delivery },
//     setPincodeApi,
//   } = useCartContext()

//   const [input, inputSet] = useState(delivery?.pincode ?? "")

//   const isPincodeSet = !!delivery?.pincode

//   const handleSubmit = () => {
//     if (input.length < 6) return

//     setPincodeApi.mutate(
//       {
//         pincode: input,
//       },
//       {
//         onSuccess: () => {
//           openSet(false)
//         },
//       },
//     )
//   }

//   return (
//     <div className="flex items-center justify-between">
//       {!isPincodeSet && (
//         <div className="text-sm font-semibold">
//           Check delivery time & services
//         </div>
//       )}

//       {isPincodeSet && (
//         <div className="text-xs">
//           <h4 className="mb-1">
//             Delivery to:{" "}
//             <span className="font-semibold">{delivery.pincode}</span>
//           </h4>

//           <p className="">Estimated Delivery: {delivery.edd}</p>
//         </div>
//       )}

//       <div>
//         <Button
//           size="sm"
//           variant="outline"
//           className="px-3"
//           onClick={() => openSet(true)}
//         >
//           {isPincodeSet ? "Change" : "Enter Pin Code"}
//         </Button>
//       </div>

//       <ModelXDrawer
//         open={open}
//         onOpenChange={openSet}
//         title="Delivery Pincode"
//         description="Enter Pincode to check its serviceability."
//       >
//         <div className="relative">
//           <Input
//             value={input}
//             onChange={(e) => inputSet(e.target.value)}
//             maxLength={6}
//           />

//           <Button
//             size="sm"
//             className="absolute right-0 top-1/2 mr-[2px] -translate-y-1/2"
//             onClick={() => handleSubmit()}
//             loading={setPincodeApi.isLoading ? "true" : "false"}
//           >
//             Check
//           </Button>
//         </div>

//         {setPincodeApi.isError && (
//           <div className="mt-2 text-sm text-red-800">
//             {setPincodeApi.error.message}
//           </div>
//         )}
//       </ModelXDrawer>
//     </div>
//   )
// }

interface ShowEddSectionProps extends React.HTMLAttributes<HTMLElement> {}

function ShowEddSection({ ...props }: ShowEddSectionProps) {
  const {} = props

  const { shippingAddress } = useCartContext()

  if (!shippingAddress) return null

  return (
    <div>
      <div className="text-xs md:text-sm">
        <h4 className="mb-1">
          Delivery to:{" "}
          <span className="font-semibold">
            {shippingAddress.firstName} {shippingAddress.lastName},
          </span>
        </h4>

        <p className="mb-4 line-clamp-1 text-muted-foreground">
          {shippingAddress.address1}, {shippingAddress.address2},{" "}
          {shippingAddress.city}, {shippingAddress.state}
        </p>

        <div className="flex w-full items-center justify-between rounded-2xl bg-slate-100 px-4 py-1 md:w-max">
          <p>
            Delivery by:
            <span className="ml-1 font-medium text-primary">
              {/* {delivery.edd} */}
            </span>
          </p>
          <Truck className="truck ml-2 h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
