import { z } from "zod"

export const ApplyCouponSchema = z.object({
  code: z.string(),
})

export type ApplyCouponSchemaProps = z.infer<typeof ApplyCouponSchema>
