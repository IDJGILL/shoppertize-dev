import { wrapTRPC } from "~/lib/trpc/trpc-instance"
import type { PincodeDetails, CourierMethods, CourierPartner, PincodeDetailsError } from "./courier-types"
import { nimbusApiClient } from "./courier-client"
import appConfig from "app.config"
import moment from "moment"
import { cookies } from "next/headers"
import { client } from "~/lib/graphql/client"
import { GetPincodeGql, type GetPincodeGqlResponse } from "../auth/auth-gql"

export const courier = {
  pincode: {
    set: async (props: Parameters<CourierMethods["pincode"]["set"]>[number]) => {
      return wrapTRPC(async (response) => {
        const edd = await courier.pincode.fetchEdd(props)

        cookies().set({
          name: "store.pincode",
          value: JSON.stringify({ pincode: props.pincode, edd: edd.data }),
          path: "/",
          secure: true,
          sameSite: "strict",
          httpOnly: true,
        })

        return response.success({
          action: "none",
          data: edd.data,
        })
      })
    },

    get: async (authToken: string | null) => {
      return wrapTRPC(async (response) => {
        const isLoggedIn = !!authToken

        if (!isLoggedIn) {
          const cookieStore = cookies().get("store.pincode")?.value

          if (!cookieStore) {
            return response.success({
              action: "none",
              data: null,
            })
          }

          const data = JSON.parse(cookieStore) as {
            pincode: string
            edd: string
          }

          return response.success({
            action: "none",
            data: data,
          })
        }

        const data = await client<GetPincodeGqlResponse, unknown>({
          access: "user",
          query: GetPincodeGql,
          authToken,
        })

        const edd = await courier.pincode.fetchEdd({
          pincode: data.customer.shipping.postcode,
        })

        return response.success({
          action: "none",
          data: {
            pincode: data.customer.shipping.postcode,
            edd: edd.data,
          },
        })
      })
    },

    fetchEdd: async (props: Parameters<CourierMethods["pincode"]["fetchEdd"]>[number]) => {
      return wrapTRPC(async (response) => {
        const request = await nimbusApiClient<{
          status: boolean
          data: CourierPartner[]
        }>({
          path: "courier/serviceability",
          payload: {
            origin: appConfig.courier.originPincode,
            destination: props.pincode,
            payment_type: "cod",
            order_amount: 500,
          },
          method: "POST",
        })

        if (!request?.status) {
          throw new ExtendedError({
            code: "BAD_REQUEST",
            message: "This pincode is not serviceable at this moment.",
          })
        }

        const courierPartners = request.data

        const edd = getCommonEdd(courierPartners)

        return response.success({
          action: "none",
          data: edd,
        })
      })
    },
  },
}

function getCommonEdd(courierPartners: CourierPartner[]) {
  const eddCounts: Record<string, number> = {}

  courierPartners.forEach((obj) => {
    eddCounts[obj.edd] = (eddCounts[obj.edd] ?? 0) + 1
  })

  let mostCommonEdd = ""

  let highestCount = 0

  for (const edd in eddCounts) {
    if (eddCounts.hasOwnProperty(edd)) {
      if (eddCounts[edd]! > highestCount) {
        highestCount = eddCounts[edd]!
        mostCommonEdd = edd
      }
    }
  }

  const today = moment()

  const edd = moment(mostCommonEdd, "DD-MM-YYYY")

  const differenceInDays = edd.diff(today, "days")

  if (differenceInDays > 5) {
    const newEddDate = today.clone().add(5, "days")

    return newEddDate.format("MMMM Do YYYY")
  }

  return moment(mostCommonEdd, "DD-MM-YYYY").format("MMMM Do YYYY")
}
