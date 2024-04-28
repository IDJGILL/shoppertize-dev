import "server-only"

import { type Shipping } from "./address-models"
import { client } from "~/lib/graphql/client"
import {
  UpdateUserMetaDataGql,
  GetAllowedCountriesGql,
  type GetAllowedCountriesGqlResponse,
  type UpdateUserMetaDataGqlInput,
  type UpdateUserMetaDataGqlResponse,
} from "./address-gql"
import type { VerifyAddress, AddressSession } from "./address-types"
import { redisCreate, redisGet } from "~/vertex/lib/redis/redis-utils"
import otpless from "~/vertex/lib/otpless/otpless-config"
import { nanoid } from "nanoid"
import { wpClient } from "~/vertex/lib/wordpress/wordpress-client"
import { phoneInputValues } from "~/vertex/lib/utils/phone-input-values"

export async function updateAddressMetaData(props: { list: Shipping[]; item: Shipping; authToken: string }) {
  await client<UpdateUserMetaDataGqlResponse, UpdateUserMetaDataGqlInput>({
    access: "user",
    query: UpdateUserMetaDataGql,
    inputs: {
      key: "address-options",
      metaData: [{ key: "address-options", value: JSON.stringify(props.list) }],
    },
    authToken: props.authToken,
  })
}

export async function sendAddressOtp(input: Shipping, action: VerifyAddress["action"]): Promise<string> {
  const { phoneNumber } = phoneInputValues(input.phone)

  const response1 = await otpless.send(phoneNumber)

  const response2 = await redisCreate<VerifyAddress>({
    idPrefix: "@verify/address",
    payload: { action: action, address: { ...input, id: nanoid() }, token: response1.token },
    ttlSec: 5 * 60,
  })

  return response2.id
}

export const getAddressOptions = async (uid: string) => {
  const session = await redisGet<AddressSession>({ id: uid, idPrefix: "@session/address" })

  return (session?.options ?? []).sort((a, b) => (a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1))
}

export const getCurrentAddress = async (uid: string) => {
  const options = await getAddressOptions(uid)

  return options.find((a) => a.isSelected)
}

export async function getAllowedCountries() {
  const data = await wpClient<GetAllowedCountriesGqlResponse, unknown>({
    access: "admin",
    query: GetAllowedCountriesGql,
  })

  return data.allowedCountries
}
