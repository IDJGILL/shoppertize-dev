import { z } from "zod"

export const GetCheckoutSessionDTO = z.object({
  recalculateTotals: z.boolean().optional(),
})

export type GetCheckoutSessionDTOType = z.infer<typeof GetCheckoutSessionDTO>

export const PaymentMethodDTO = z.union([
  z.literal("COD"),
  z.literal("WALLET"),
  z.literal("ONLINE"),
])

export type PaymentMethodType = z.infer<typeof PaymentMethodDTO>
