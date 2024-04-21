import { z } from "zod"

export const CartItemRecordSchema = z.object({
  id: z.string(),
  quantity: z.number(),
})

export type CartItemRecordSchemaProps = z.infer<typeof CartItemRecordSchema>
