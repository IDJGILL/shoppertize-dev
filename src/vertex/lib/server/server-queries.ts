import { z } from "zod"
import { authQuery, publicQuery } from "./server-query-helper"
import { getAddressById } from "~/vertex/modules/address/address-controllers"
import { $Null } from "~/vertex/modules/auth/auth-models"
import { getAddressOptions, getCurrentAddress } from "~/vertex/modules/address/address-server-utils"
import { getPostcodeServiceability } from "~/vertex/modules/courier/courier-controllers"

export const queryAddressById = authQuery(z.string(), async (input, ctx) => {
  return await getAddressById(ctx.user.id, input)
})

export const queryAddressOptions = authQuery($Null, async (_, ctx) => {
  return await getAddressOptions(ctx.authToken)
})

export const queryPostcodeServiceability = publicQuery(async () => {
  return await getPostcodeServiceability()
})

export const queryCurrentAddress = publicQuery(async (session) => {
  if (!session) return null

  return await getCurrentAddress(session.user.id)
})
