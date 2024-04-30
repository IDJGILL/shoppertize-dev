import { z } from "zod"

export const $IndianPostcode = z.object({
  postcode: z.string().min(6, "Please enter valid postcode").max(6, "Please enter valid postcode"),
})

export type IndianPostcode = z.infer<typeof $IndianPostcode>
