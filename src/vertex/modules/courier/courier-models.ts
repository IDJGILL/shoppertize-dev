import { z } from "zod"

export const $IndianPostcode = z.string().min(6).max(6)

export type IndianPostcode = z.infer<typeof $IndianPostcode>
