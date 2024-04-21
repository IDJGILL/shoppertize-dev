import { userQueryV2 } from "~/lib/server/access/graphql"
import { UPDATE_META } from "../../../auth/auth.gql"
import { TRPCError } from "@trpc/server"
import { env } from "~/env.mjs"
import { sha256 } from "js-sha256"
import { meta } from "~/lib/utils/functions/meta"
import { createOrderConfirmationToken } from "~/lib/utils/functions/jwt"
import { base64 } from "~/lib/utils/functions/base64"
import { nanoid } from "nanoid"

type CreatePhonePePayPageURIInput = {
  customerId: string
  totalPayable: number
  authToken: string
}

export const createPayPageURI = async (input: CreatePhonePePayPageURIInput) => {
  const uniqueId = nanoid(5)

  const transactionReferenceId = base64.create([uniqueId, input.customerId])

  const token = await createOrderConfirmationToken({
    id: transactionReferenceId,
    method: "ONLINE",
  })

  await userQueryV2({
    query: UPDATE_META,
    variables: {
      metaData: [meta.token.order.add(token)],
    },
    authToken: input.authToken,
  })

  const callbackUrl = `${env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/webhooks/order?token=${token}`

  const payload = createPayPagePayload({
    merchantTransactionId: transactionReferenceId,
    merchantUserId: input.customerId,
    amount: input.totalPayable * 100,
    redirectUrl: callbackUrl,
    redirectMode: "GET",
    callbackUrl: callbackUrl,
  })

  const paymentResponse = await fetch(env.PHONEPE_PAYMENT_API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": payload.xVerify,
    },
    body: JSON.stringify({
      request: payload.base64Payload,
    }),
  })

  const paymentJson = (await paymentResponse.json()) as PhonePePayPageType

  return paymentJson.data.instrumentResponse.redirectInfo.url
}

function createPayPagePayload(payload: PhonePePayPagePayload) {
  const base64 = btoa(
    JSON.stringify(
      {
        ...{
          ...payload,
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        },
        merchantId: env.PHONEPE_MERCHANT_ID,
      },
      null,
      2,
    ),
  )

  const payloadString = base64 + "/pg/v1/pay" + env.PHONEPE_MERCHANT_SALT_KEY

  const hash = sha256.hex(payloadString)

  return {
    xVerify: `${hash}###1`,
    base64Payload: base64,
  }
}

export const checkPhonepePaymentStatus = async (
  merchantTransactionId: string,
) => {
  const payload = createStatusCheckPayload(merchantTransactionId)

  try {
    const response = await fetch(
      `${env.PHONEPE_PAYMENT_STATUS_API_URI}/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": payload.xVerify,
          "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
        },
        cache: "no-cache",
      },
    )

    const json = (await response.json()) as PhonePePaymentStatus

    return json.code
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error checking payment status",
    })
  }
}

export default function createStatusCheckPayload(
  merchantTransactionId: string,
) {
  const payloadString =
    `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
    env.PHONEPE_MERCHANT_SALT_KEY

  const hash = sha256.hex(payloadString)

  return {
    xVerify: `${hash}###1`,
  }
}
