import { z } from "zod"

export const ApiCarouselSchema = z.object({
  cursor: z.string().nullish(),
  excludeProducts: z.array(z.string()).optional(),
  category: z.string(),
})

export type ApiCarouselSchemaProps = z.infer<typeof ApiCarouselSchema>
