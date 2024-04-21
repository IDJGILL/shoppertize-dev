import { wrapTRPC } from "~/lib/trpc/trpc-instance"
import type {
  PhonePeCallbackResponse,
  PhonePePayPagePayload,
  PhonePePayPageType,
  PhonePePaymentStatus,
  WalletBalance,
  WalletData,
  WalletTransaction,
} from "./payment-types"
import { sha256 } from "js-sha256"
import { TRPCError } from "@trpc/server"
import { woocommerce } from "~/lib/server/access/woocommerce"
import { checkout } from "../checkout/checkout-methods"
import { nanoid } from "nanoid"
import { env } from "~/env.mjs"
import { type NextRequest } from "next/server"
import { base64 } from "~/lib/utils/functions/base64"

// Phone Pay Test Variables
export const LIVE_TEST_DOMAIN = "https://4r9tl1g1-3000.inc1.devtunnels.ms"

export const payment = {
  gateway: {
    phonepe: {
      init: async (props: { amount: number; referenceId: string }) => {
        return wrapTRPC<{ url: string }, "none">(async (response) => {
          const checkoutSession = await checkout.session.get(props.referenceId)

          const redirectUrl = `${LIVE_TEST_DOMAIN}/checkout/order/status?referenceId=${checkoutSession.referenceId}`

          const callbackUrl = `${LIVE_TEST_DOMAIN}/api/payment?referenceId=${checkoutSession.referenceId}`

          const payload = {
            merchantId: env.PHONEPE_MERCHANT_ID,
            merchantTransactionId: checkoutSession.referenceId,
            merchantUserId: nanoid(5),
            amount: 1000,
            redirectUrl: redirectUrl,
            redirectMode: "REDIRECT",
            callbackUrl: callbackUrl,
            paymentInstrument: {
              type: "PAY_PAGE",
            },
          } satisfies PhonePePayPagePayload

          const base64String = base64.create([JSON.stringify(payload)])

          const payloadString =
            base64String + "/pg/v1/pay" + env.PHONEPE_MERCHANT_SALT_KEY

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

          return response.success({
            action: "none",
            data: {
              url: json.data.instrumentResponse.redirectInfo.url,
            },
          })
        })
      },

      validate: async (req: NextRequest) => {
        const json = (await req.json()) as { response: string }

        const referenceId = req.nextUrl.searchParams.get("referenceId")

        if (!referenceId) throw new Error("referenceId not missing.")

        const payload = base64.parse<PhonePeCallbackResponse>({
          base64Id: json.response,
          index: 0,
        })

        console.log({ payload })

        // const id = await order.handle({ referenceId, paymentMethod: "ONLINE" })
      },

      status: async (props: { referenceId: string }) => {
        return wrapTRPC<{ status: PhonePePaymentStatus["code"] }, "none">(
          async (response) => {
            const payloadString =
              `/pg/v1/status/${env.PHONEPE_MERCHANT_ID}/${props.referenceId}` +
              env.PHONEPE_MERCHANT_SALT_KEY

            const hash = sha256.hex(payloadString)

            const request = await fetch(
              `${env.PHONEPE_PAYMENT_STATUS_API_URI}/${env.PHONEPE_MERCHANT_ID}/${props.referenceId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-VERIFY": `${hash}###1`,
                  "X-MERCHANT-ID": env.PHONEPE_MERCHANT_ID,
                },
                cache: "no-cache",
              },
            )

            const json = (await request.json()) as PhonePePaymentStatus

            return response.success({
              action: "none",
              data: {
                status: json.code,
              },
            })
          },
        )
      },
    },
  },

  wallet: {
    get: async (props: { email: string }) => {
      return wrapTRPC<
        {
          transactions: WalletTransaction[]
          balance: WalletBalance
        },
        "none"
      >(async (response) => {
        const data = await woocommerce<WalletData[]>(
          "GET",
          `wallet?email=${props.email}`,
          undefined,
          "no-cache",
        )

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

        return response.success({
          action: "none",
          data: {
            balance,
            transactions,
          },
        })
      })
    },

    debit: async (props: { email: string; amount: number; note: string }) => {
      const response = await woocommerce<{ response: "success"; id: number }>(
        "POST",
        "wallet",
        {
          email: props.email,
          type: "debit",
          amount: props.amount,
          note: props.note,
        },
        "no-cache",
      )

      if (response.response !== "success") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }
    },
  },
}
