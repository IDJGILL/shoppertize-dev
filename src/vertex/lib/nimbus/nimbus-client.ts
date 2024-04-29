import "server-only"

import { env } from "~/env.mjs"
import type {
  NimbusCourierServiceabilityResponse,
  NimbusCourierServiceability,
  NimbusAuthData,
  NimbusTracking,
} from "./nimbas-types"
import { ExtendedError } from "../utils/extended-error"
import { formatDistanceToNow } from "date-fns"
import type { CourierTrackingHistory, CourierAdapter } from "~/vertex/modules/courier/courier-types"
import { standardDateTime } from "../utils/standard-date-time"

export const nimbusAdapter: CourierAdapter = {
  serviceability: async (origin, destination) => {
    const request = await fetch(`${env.NIMBUS_BASE_URI}/courier/serviceability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getNimbusAuthToken()}`,
      },

      body: JSON.stringify({
        origin,
        destination,
        payment_type: "prepaid",
      } satisfies NimbusCourierServiceability),
    })

    const json = (await request.json()) as { status: boolean; data: NimbusCourierServiceabilityResponse }

    if (!json.status) return null

    type EddRankItem = { date: string; count: number }

    const eddRanks: EddRankItem[] = []

    json.data.forEach((item) => {
      const exist = eddRanks.findIndex((a) => a.date === item.edd)

      if (eddRanks[exist]) {
        return (eddRanks[exist] = { date: item.edd, count: (eddRanks[exist]?.count ?? 0) + 1 })
      }

      eddRanks.push({ date: item.edd, count: 0 })
    })

    const sortedEdd = eddRanks.sort((a, b) => b.count - a.count)[0]

    if (!sortedEdd) return null

    const date = standardDateTime(sortedEdd.date, "dd-MM-yyyy")

    return {
      distanceString: formatDistanceToNow(date, { addSuffix: true }),
      date: date.toLocaleDateString(),
      distanceNumeric: +(formatDistanceToNow(date, { addSuffix: false }).split(" ")[0] ?? ""),
    }
  },

  tracking: async (awb) => {
    const request = await fetch(`${env.NIMBUS_BASE_URI}/shipments/track/${awb}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getNimbusAuthToken()}`,
      },
    })

    const json = (await request.json()) as NimbusTracking

    if (!json.status) return null

    const history = json.data.history.reduce<CourierTrackingHistory[]>((acc, item) => {
      switch (item.status_code) {
        case "PP": {
          acc.push({
            status: { code: "PP", label: "Pending Pickup" },
            time: item.event_time,
            location: item.location,
            message: item.message,
          })

          break
        }

        case "IT": {
          acc.push({
            status: { code: "IT", label: "In Transit" },
            time: item.event_time,
            location: item.location,
            message: item.message,
          })
        }

        case "OFD": {
          acc.push({
            status: { code: "OFD", label: "Out For Delivery" },
            time: item.event_time,
            location: item.location,
            message: item.message,
          })
        }

        case "DL": {
          acc.push({
            status: { code: "DL", label: "Delivered" },
            time: item.event_time,
            location: item.location,
            message: item.message,
          })
        }

        default: {
          acc.push({
            status: { code: "PP", label: "Pending Pickup" },
            time: item.event_time,
            location: item.location,
            message: item.message,
          })
        }
      }

      return acc
    }, [])

    return { status: history[0]?.status ?? { code: "PP", label: "Pending Pickup" }, history }
  },
}

const getNimbusAuthToken = async (): Promise<string | null> => {
  const request = await fetch(`${env.NIMBUS_BASE_URI}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: env.NIMBUS_EMAIL,
      password: env.NIMBUS_PASSWORD,
    }),
  })

  const json = (await request.json()) as NimbusAuthData

  if (!json.status) throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: json.message })

  return json.data
}
