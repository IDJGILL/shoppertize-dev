import { nimbusApiClient } from "./courier-client"
import { CourierServiceSchema } from "./courier-schemas"
import { type NimbusTracking } from "./courier-types"
import type { Tracking } from "../order/utils/order-types"
import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"
import { courier } from "./courier-methods"

const trackOrder = async (awb: string) => {
  const request = await nimbusApiClient<NimbusTracking>({
    path: `shipments/track/${awb}`,
    method: "GET",
  })

  if (!request?.status) return null

  return request.data
}

export const bulkNimbusOrderTracking = async (awb: string[]) => {
  const trackingRequests = await Promise.allSettled(awb.map(trackOrder))

  return trackingRequests.reduce<Tracking[]>((acc, data) => {
    if (data.status === "fulfilled" && !!data.value?.status) {
      acc.push({
        awb_number: data.value.awb_number,
        created: data.value.created,
        delivered_date: data.value.delivered_date,
        edd: data.value.edd,
        history: data.value.history,
        shipped_date: data.value.shipped_date,
        status: data.value.status,
      })
    }

    return acc
  }, [])
}

export const singleNimbusOrderTracing = async (awb: string) => {
  const track = await trackOrder(awb)

  if (!track) return null

  return {
    awb_number: track.awb_number,
    created: track.created,
    delivered_date: track.delivered_date,
    edd: track.edd,
    history: track.history,
    shipped_date: track.shipped_date,
    status: track.status,
  } as Tracking
}

export const courierRoutes = createTRPCRouter({
  setPincode: publicProcedure
    .input(CourierServiceSchema)
    .mutation(async ({ input }) => await courier.pincode.set(input)),

  checkService: publicProcedure
    .input(CourierServiceSchema)
    .mutation(async ({ input }) => await courier.pincode.checkService(input)),
})
