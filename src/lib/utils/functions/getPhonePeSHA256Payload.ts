import { env } from '~/env.mjs'
import { sha256 } from 'js-sha256'

export default function getPhonePeSHA256Payload<TData>(payload: TData, customPath?: string) {
  const base64String = btoa(
    JSON.stringify(
      {
        ...payload,
        merchantId: env.PHONEPE_MERCHANT_ID,
      },
      null,
      2
    )
  )

  const combinedSha256 = base64String + `${customPath ? customPath : '/pg/v1/pay'}` + env.PHONEPE_MERCHANT_SALT_KEY

  const hashString = sha256.hex(combinedSha256)

  return {
    xVerify: `${hashString}###1`,
    base64Payload: base64String,
  }
}
