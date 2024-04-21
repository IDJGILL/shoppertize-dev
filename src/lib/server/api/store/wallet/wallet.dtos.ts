import { z } from "zod"

export const WalletActionSchema = z.object({
  action: z.enum(["apply", "remove"]),
})

export type WalletActionSchemaProps = z.infer<typeof WalletActionSchema>
