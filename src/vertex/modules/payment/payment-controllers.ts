import "server-only"
import { env } from "~/env.mjs"
import type {
  PhonePeCallbackResponse,
  PhonePePayPagePayload,
  PhonePePayPageType,
  PhonePePaymentStatus,
  PhonePePaymentStatusEnum,
  WalletBalance,
  WalletData,
  WalletTransaction,
} from "./payment-types"
import { nanoid } from "nanoid"
import { base64 } from "~/lib/utils/functions/base64"
import { sha256 } from "js-sha256"
import { wooClient } from "~/vertex/lib/wordpress/woocommerce-client"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"

export const LIVE_TEST_DOMAIN = "https://4r9tl1g1-3000.inc1.devtunnels.ms"

export const phonePayPagePage = async (): Promise<{ url: string }> => {
  //   const checkoutSession = await checkout.session.get(props.referenceId)

  const referenceId = "" // Todo

  const redirectUrl = `${LIVE_TEST_DOMAIN}/checkout/order/status?referenceId=${referenceId}`

  const callbackUrl = `${LIVE_TEST_DOMAIN}/api/payment?referenceId=${referenceId}`

  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: referenceId,
    merchantUserId: nanoid(5), // Todo
    amount: 1000,
    redirectUrl: redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: callbackUrl,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  } satisfies PhonePePayPagePayload

  const base64String = base64.create([JSON.stringify(payload)])

  const payloadString = base64String + "/pg/v1/pay" + env.PHONEPE_MERCHANT_SALT_KEY

  const hash = sha256.hex(payloadString)

  const request = await fetch(env.PHONEPE_PAYMENT_API_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": `${hash}###1`,
    },
    body: JSON.stringify({
      request: base64String,
    }),
  })

  const json = (await request.json()) as PhonePePayPageType

  return {
    url: json.data.instrumentResponse.redirectInfo.url,
  }
}

export const validatePhonePePayment = (response: string, referenceId: string) => {
  const payload = base64.parse<PhonePeCallbackResponse>({
    base64Id: response,
    index: 0,
  })

  console.log({ payload })

  // const id = await order.handle({ referenceId, paymentMethod: "ONLINE" })
}

export const checkPhonePePaymentStatus = async (referenceId: string): Promise<{ status: PhonePePaymentStatusEnum }> => {
  const payloadString = `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${referenceId}` + env.PHONEPE_MERCHANT_SALT_KEY

  const hash = sha256.hex(payloadString)

  const request = await fetch(`${env.PHONEPE_PAYMENT_STATUS_API_URI}/${env.PHONEPE_MERCHANT_ID}/${referenceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": `${hash}###1`,
      "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
    },
    cache: "no-cache",
  })

  const json = (await request.json()) as PhonePePaymentStatus

  return {
    status: json.code,
  }
}

export const getWallet = async (
  email: string,
): Promise<{
  balance: {
    amount: number
    currency: string
  }
  transactions: WalletTransaction[]
}> => {
  const data = await wooClient<WalletData[]>({
    method: "GET",
    path: "wallet",
    params: { email },
    cacheConfig: "no-cache",
  })

  const balance = {
    amount: +(data[0]?.balance ?? "0"),
    currency: data[0]?.currency ?? "",
  } satisfies WalletBalance

  const transactions: WalletTransaction[] = data.map((a) => ({
    amount: a.amount,
    balance: a.balance,
    date: a.date,
    details: a.details,
    type: a.type,
    transaction_id: a.transaction_id,
  }))

  return {
    balance,
    transactions,
  }
}

export const debitWallet = async (props: { email: string; amount: number; note: string }): Promise<void> => {
  const response = await wooClient<{ response: "success"; id: number }>({
    method: "POST",
    path: "wallet",
    data: {
      email: props.email,
      type: "debit",
      amount: props.amount,
      note: props.note,
    },
    cacheConfig: "no-cache",
  })

  if (response.response !== "success") {
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR" })
  }
}
