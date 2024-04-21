"use client"

import { CheckCircle, ChevronRight } from "lucide-react"
import moment from "moment"
import { useState } from "react"
import Box from "~/app/_components/box"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
// import type { NimbusTrackingSuccess } from "~/lib/modules/courier/utils/courier-types"
import type {
  SingleOrder,
  Tracking,
} from "~/lib/modules/order/utils/order-types"
import { formatDate } from "~/lib/utils/functions/format-date"
import { cn } from "~/lib/utils/functions/ui"

interface OrderTrackingProps extends React.HTMLAttributes<HTMLElement> {
  order: SingleOrder
}

// const TRACKING = {
//   id: "40588454",
//   order_id: "75991759",
//   order_number: "1626",
//   created: "2024-02-22",
//   edd: "2024-02-24",
//   pickup_date: "2024-02-22",
//   rto_initiate_date: "",
//   delivered_date: "2024-02-23",
//   shipped_date: "2024-02-22",
//   awb_number: "7D8774132",
//   rto_awb: "",
//   courier_id: "204",
//   courier_name: "DTDC",
//   warehouse_id: "176892",
//   rto_warehouse_id: "176892",
//   status: "delivered",
//   event_time: "2024-02-23 12:00:58",
//   rto_status: "",
//   shipment_info: "{}",
//   payment_type: "prepaid",
//   history: [
//     // {
//     //   status_code: "DL",
//     //   location: "WAZIRPUR BRANCH",
//     //   event_time: "2024-02-23 11:41:00",
//     //   message: "REKHA AGGARWAL",
//     // },
//     {
//       status_code: "OFD",
//       location: "WAZIRPUR BRANCH",
//       event_time: "2024-02-23 10:35:00",
//       message: "",
//     },
//     {
//       status_code: "IT",
//       location: "GURGAON APEX",
//       event_time: "2024-02-23 08:01:00",
//       message: "0.00",
//     },
//     {
//       status_code: "IT",
//       location: "DELHI SAMALKHA APEX",
//       event_time: "2024-02-23 07:37:00",
//       message: "",
//     },
//     {
//       status_code: "IT",
//       location: "DELHI SAMALKHA APEX",
//       event_time: "2024-02-23 02:45:00",
//       message:
//         "Out Going Load Made To WAZIRPUR BRANCH via  Master ConNo.C03463758821698816704",
//     },
//     {
//       status_code: "IT",
//       location: "GURGAON APEX",
//       event_time: "2024-02-23 00:40:00",
//       message: "",
//     },
//     {
//       status_code: "IT",
//       location: "GURGAON APEX",
//       event_time: "2024-02-22 22:37:00",
//       message:
//         "Out Going Load Made To DELHI SAMALKHA APEX via  Master ConNo.C19158015608357436023",
//     },
//     // {
//     //   status_code: "dasdsadasd",
//     //   location: "GURGAON APEX",
//     //   event_time: "2024-02-22 20:28:00",
//     //   message: "",
//     // },
//     {
//       status_code: "PP",
//       location: "GURGAON APEX",
//       event_time: "2024-02-22 13:36:00",
//       message: "",
//     },
//     {
//       status_code: "PP",
//       location: "GURGAON APEX",
//       event_time: "2024-02-22 13:12:00",
//       message: "",
//     },
//   ],
// } satisfies NimbusTrackingSuccess["data"]

const getProgressOne = (order: SingleOrder, orderTracking?: Tracking) => {
  const isInTransit = orderTracking?.history.some((a) => a.status_code === "IT")

  if (isInTransit) return 33.3 * 3

  if (order.status === "PROCESSING") return 0

  if (order.status === "PACKED") return 33.3

  if (order.status === "READYTODISPATCH") return 33.3 * 2

  return 0
}

const getProgressTwo = (orderTracking?: Tracking) => {
  const inTransitCount =
    orderTracking?.history.filter((a) => a.status_code === "IT") ?? []

  const isOutForDelivery = orderTracking?.history.some(
    (a) => a.status_code === "OFD",
  )

  if (isOutForDelivery) return 25 * 4

  if (inTransitCount.length === 1) return 25

  if (inTransitCount.length === 2) return 25 * 2

  if (inTransitCount.length >= 3) return 25 * 3

  return 0
}

const getProgressThree = (orderTracking?: Tracking) => {
  const isDelivered = orderTracking?.history.some((a) => a.status_code === "DL")

  const isOutForDelivery = orderTracking?.history.some(
    (a) => a.status_code === "OFD",
  )

  if (!isOutForDelivery) return 0

  if (isDelivered) return 100

  const currentTime = moment()

  const startOfDay = moment().startOf("day")

  const endOfDay = moment().endOf("day")

  const totalDuration = endOfDay.diff(startOfDay, "minutes")

  const elapsedDuration = currentTime.diff(startOfDay, "minutes")

  const progressPercentage = (elapsedDuration / totalDuration) * 100

  return progressPercentage * 2
}

export default function OrderTracking({ ...props }: OrderTrackingProps) {
  const { order } = props
  const [open, openSet] = useState(false)

  const progressOne = getProgressOne(order, order.tracking)

  const progressTwo = getProgressTwo(order.tracking)

  const progressThree = getProgressThree(order.tracking)

  if (order.status === "DELIVERED") {
    return (
      <Box>
        <div className="flex gap-4">
          <CheckCircle className="text-primary" />
          <div>
            <h4 className="font-semibold">Thanks for your order</h4>
            <p className="text-sm">Your order has been delivered.</p>
          </div>
        </div>
      </Box>
    )
  }

  return (
    <Box className="!p-0">
      <div className="my-4 w-full">
        <div className="flex py-3">
          <div className="flex-1"></div>

          <ProgressBarIcon isActive={progressOne >= 0} />
          <ProgressBar progress={progressOne} />

          <ProgressBarIcon isActive={!!progressTwo} />
          <ProgressBar progress={progressTwo} />

          <ProgressBarIcon isActive={!!progressThree} />
          <ProgressBar progress={progressThree} />

          <ProgressBarIcon isActive={progressThree === 100} />

          <div className="flex-1"></div>
        </div>

        <div className="flex content-center text-center text-xs">
          <div className="w-1/4 font-semibold text-primary">Ordered</div>

          <div className="w-1/4">Shipped</div>

          <div className="w-1/4">Out for Delivery</div>

          <div className="w-1/4">Delivered</div>
        </div>
      </div>

      {!!order.tracking && (
        <>
          <div
            onClick={() => openSet(true)}
            className="flex cursor-pointer items-center justify-between border-t !px-4 py-4 hover:bg-slate-50 md:px-0"
          >
            <div className="text-sm font-medium text-muted-foreground">
              Tracking ID: #{order.tracking.awb_number}
              <p className="text-xs text-primary">See all updates</p>
            </div>

            <ChevronRight className="size-4" />
          </div>

          <ModelXDrawer open={open} onOpenChange={openSet}>
            <ScrollArea className="h-[400px]">
              <h3 className="text-lg font-semibold">Delivery by DTDC</h3>
              <p className="mb-8 text-sm">
                Tracking ID: {order.tracking.awb_number}
              </p>

              <div className="space-y-4">
                {order.tracking.history.some((a) => a.status_code === "DL") && (
                  <div className="px-4">
                    <div className="text-sm">Delivered</div>

                    <div className=" text-xs italic text-muted-foreground">
                      at:{" "}
                      {formatDate({
                        date: order.tracking.delivered_date,
                        format: "h:mm:ss a",
                      })}
                    </div>
                  </div>
                )}

                {order.tracking.history.map((a, index) => (
                  <div key={a.event_time} className="flex ">
                    <div className="px-4">
                      <div className="text-sm">
                        {a.location} {`${index === 0 ? "(current)" : ""}`}
                      </div>

                      <div className=" text-xs italic text-muted-foreground">
                        at:{" "}
                        {formatDate({
                          date: a.event_time,
                          format: "h:mm:ss a",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </ModelXDrawer>
        </>
      )}
    </Box>
  )
}

interface ProgressBarIconProps extends React.HTMLAttributes<HTMLElement> {
  isActive: boolean
}

function ProgressBarIcon({ ...props }: ProgressBarIconProps) {
  const {} = props

  return (
    <div className="flex-1">
      <div
        className={cn(
          "mx-auto flex size-4 items-center rounded-full text-lg text-white",
          {
            "bg-primary": props.isActive,
            border: !props.isActive,
          },
        )}
      ></div>
    </div>
  )
}

interface ProgressBarProps extends React.HTMLAttributes<HTMLElement> {
  progress: number
}

function ProgressBar({ ...props }: ProgressBarProps) {
  const { progress } = props

  return (
    <div className="align-center flex w-1/6 content-center items-center align-middle">
      <div className="align-center w-full flex-1 items-center rounded bg-gray-100 align-middle">
        <div
          className="text-grey-darkest rounded bg-primary py-[2px] text-center text-xs leading-none "
          style={{ width: progress + "%" }}
        ></div>
      </div>
    </div>
  )
}
