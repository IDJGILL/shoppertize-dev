import { z } from "zod"
import { pathList, cacheTagList } from "./constants"

export const $Revalidate = z.object({
  paths: z.enum([...pathList]).array(),
  tags: z.enum([...cacheTagList]).array(),
})

export type Revalidate = z.infer<typeof $Revalidate>
