import { z } from "zod"

export const InfiniteOrdersSchema = z.object({
  limit: z.number(),
  cursor: z.string().nullish(),
})

export type InfiniteOrdersSchemaProps = z.infer<typeof InfiniteOrdersSchema>

export const PaymentMethodSchema = z.union([
  z.literal("COD"),
  z.literal("WALLET"),
  z.literal("ONLINE"),
])

export type PaymentMethodSchemaProps = z.infer<typeof PaymentMethodSchema>
