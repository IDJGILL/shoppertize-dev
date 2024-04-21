import { z } from "zod"

export const $CartItem = z.object({
  id: z.string(),
  quantity: z.number(),
})

export type CartItem = z.infer<typeof $CartItem>

export const $RemoveCartItem = z.object({
  id: z.string(),
  quantity: z.number(),
})

export type RemoveCartItem = z.infer<typeof $RemoveCartItem>
