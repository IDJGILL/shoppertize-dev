import { z } from "zod"

export const $PaymentMethod = z.enum(["COD", "ONLINE", "WALLET"])

export type PaymentMethod = z.infer<typeof $PaymentMethod>
