import { z } from "zod"
import { pathList, cacheTagList } from "./global-constants"

export const $Revalidate = z.object({
  paths: z
    .enum([...pathList])
    .array()
    .optional(),
  tags: z
    .enum([...cacheTagList])
    .array()
    .optional(),
})

export type Revalidate = z.infer<typeof $Revalidate>
