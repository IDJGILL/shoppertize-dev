import { z } from "zod"
import { authQuery } from "./server-query-helper"
import { getAddressById } from "~/vertex/modules/address/address-controllers"

export const queryAddressById = authQuery(z.string(), async (input, ctx) => {
  return await getAddressById(ctx.authToken, input)
})
