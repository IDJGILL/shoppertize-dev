import { z } from "zod"

export const $CouponCode = z.object({
  code: z.string(),
})
