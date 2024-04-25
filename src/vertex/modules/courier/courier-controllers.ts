import "server-only"
import { getShipRocketAuthToken } from "~/vertex/lib/shiprocket/shiprocket-config"
import type { IndianPostcode } from "./courier-models"
import type { PincodeDetails, PincodeDetailsError } from "./courier-types"
import { ExtendedError } from "~/vertex/utils/extended-error"

export const checkPostcodeService = async (postcode: IndianPostcode) => {
  const token = await getShipRocketAuthToken()

  const params = new URLSearchParams({
    weight: "0.01",
    delivery_postcode: postcode,
    pickup_postcode: "122006",
    cod: "1",
  }).toString()

  const request = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = (await request.json()) as
    | {
        data: PincodeDetails
      }
    | PincodeDetailsError

  console.log({ data })

  if ("message" in data) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "This pincode is not serviceable at this moment.",
    })
  }

  const pincodeDetails = data.data.available_courier_companies[0]

  if (!pincodeDetails) {
    throw new ExtendedError({
      code: "BAD_REQUEST",
      message: "This pincode is not serviceable at this moment.",
    })
  }

  return {
    city: pincodeDetails.city,
    state: pincodeDetails.state,
  }
}
