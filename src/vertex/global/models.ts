import { z } from "zod"
import { paths, tags } from "./paths-and-tags"

export const $Revalidate = z.object({
  paths: z.enum([...paths]).array(),
  tags: z.enum([...tags]).array(),
})

export type Revalidate = z.infer<typeof $Revalidate>
