import { z } from "zod"

export const CourierServiceSchema = z.object({
  pincode: z.string().min(6).max(6),
})

export type CourierServiceSchemaProps = z.infer<typeof CourierServiceSchema>

export const NimbusTrackingSchema = z
  .object({
    type: z.enum(["single"]),
    awb: z.string().min(1).max(100),
  })
  .or(
    z.object({
      type: z.enum(["bulk"]),
      awb: z.array(z.string().min(1).max(100)),
    }),
  )

export type NimbusTrackingSchemaProps = z.infer<typeof NimbusTrackingSchema>
