import { z } from "zod"

export const CollectionFiltersDTO = z.object({
  id: z.string(),
  taxonomyFilter: z.object({
    filters: z.array(
      z.object({
        ids: z.array(z.number()),
        taxonomy: z.string().min(1),
        terms: z.array(z.string()),
        operator: z.enum(["AND", "IN"]),
      }),
    ),
    relation: z.enum(["AND", "OR"]),
  }),
})

export type CollectionFiltersDTOType = z.infer<typeof CollectionFiltersDTO>

export const GetProductStockDTO = z.object({
  productId: z.string(),
  tag: z.string(),
})

export type GetProductStockDTOType = z.infer<typeof GetProductStockDTO>

export const RevalidateSchema = z.array(
  z.object({
    type: z.enum(["TAG", "PATH"]),
    items: z.array(z.string()),
  }),
)

export type RevalidateSchemaProps = z.infer<typeof RevalidateSchema>
