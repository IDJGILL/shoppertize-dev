import { z } from "zod"

export const ProductReviewInputDTO = z.object({
  orderId: z.string(),
  commentOn: z.number(),
  rating: z.string().max(5),
  content: z.string(),
})

export type ProductReviewInputDTOType = z.infer<typeof ProductReviewInputDTO>

export const ProductReviewFieldDTO = z.object({
  rating: z.string().max(5),
  content: z.string(),
})

export type ProductReviewFieldDTOType = z.infer<typeof ProductReviewFieldDTO>
