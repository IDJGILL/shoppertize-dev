import { z } from "zod"

export const AddReviewSchema = z.object({
  orderId: z.number().min(1),
  productId: z.number().min(1),
  rating: z.number().min(1),
  comment: z.string().min(1).max(200),
})

export type AddReviewSchemaProps = z.infer<typeof AddReviewSchema>

export const ShoppingFeedbackSchema = z.object({
  rating: z.number().min(1),
  comment: z.string().max(200).optional(),
})

export type ShoppingFeedbackSchemaProps = z.infer<typeof ShoppingFeedbackSchema>

export const BulkReviewsSchema = z.object({
  productId: z.number().min(1),
  superSecretKey: z.string().min(1),
  reviews: z.array(
    z.object({
      name: z.string(),
      rating: z.number().min(1),
      comment: z.string().max(200),
    }),
  ),
})

export type BulkReviewsSchemaProps = z.infer<typeof BulkReviewsSchema>

export const InfiniteReviewsSchema = z.object({
  limit: z.number(),
  cursor: z.string().nullish(),
  slug: z.string(),
})

export type InfiniteReviewsSchemaProps = z.infer<typeof InfiniteReviewsSchema>
