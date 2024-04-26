import { z } from "zod"
import { authQuery } from "./server-query-helper"
import { getAddressById } from "~/vertex/modules/address/address-controllers"
import { $Null } from "~/vertex/modules/auth/auth-models"
import { getAddressOptions } from "~/vertex/modules/address/address-server-utils"

export const queryAddressById = authQuery(z.string(), async (input, ctx) => {
  return await getAddressById(ctx.user.id, input)
})

export const queryAddressOptions = authQuery($Null, async (_, ctx) => {
  return await getAddressOptions(ctx.authToken)
})
