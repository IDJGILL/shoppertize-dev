import { z } from "zod"

export type CollectionProductsSchemaProps = z.infer<
  typeof CollectionProductsSchema
>

export const TaxonomyFilterSchema = z.object({
  taxonomyFilter: z.object({
    filter: z.object({
      ids: z.array(z.number()),
      taxonomy: z.string().min(1),
      terms: z.array(z.string()),
      operator: z.enum(["AND", "IN"]),
    }),
    relation: z.enum(["AND", "OR"]),
  }),
})

export type TaxonomyFilterSchemaProps = z.infer<typeof TaxonomyFilterSchema>

export const CollectionProductsSchema = z
  .object({
    cursor: z.string().nullish(),
    excludeItemIds: z.array(z.string()).optional(),
  })
  .and(TaxonomyFilterSchema)

const ApiFilterProductsSchema = z.object({
  cursor: z.string().nullish(),
  excludeItemIds: z.array(z.string()).optional(),
  taxonomyFilter: z
    .object({
      filters: z.array(
        z.object({
          ids: z.array(z.number()),
          taxonomy: z.string().min(1),
          operator: z.enum(["AND", "IN"]),
          terms: z.array(z.string()),
        }),
      ),
      relation: z.enum(["AND", "OR"]),
    })
    .optional(),
})

export type ApiFilterProductsSchemaProps = z.infer<
  typeof ApiFilterProductsSchema
>
