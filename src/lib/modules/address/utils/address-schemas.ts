import { z } from "zod"

export const EmailOtpSchema = z.object({
  otp: z.string().optional(),
  token: z.string().optional(),
})

export const ShippingSchema = z.object({
  shipping_firstName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_lastName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_address1: z.string().min(1, "Required").max(150, "Too long."),
  shipping_address2: z.string().min(1, "Required").max(150, "Too long."),
  shipping_phone: z.string().min(6, "Required"),
  shipping_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  shipping_city: z.string().min(1, "Required").max(150, "Too long."),
  shipping_state: z.string().min(1, "Required").max(150, "Too long."),
  shipping_otp: z.string().optional(),
  shipping_token: z.string().optional(),
  gstInvoice: z.literal(false),
})

export type ShippingSchemaProps = z.infer<typeof ShippingSchema>

export const BothAddress = z.object({
  shipping_firstName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_lastName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_address1: z.string().min(1, "Required").max(150, "Too long."),
  shipping_address2: z.string().min(1, "Required").max(150, "Too long."),
  shipping_phone: z.string().min(6, "Required"),
  shipping_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  shipping_city: z.string().min(1, "Required").max(150, "Too long."),
  shipping_state: z.string().min(1, "Required").max(150, "Too long."),
  shipping_otp: z.string().optional(),
  shipping_token: z.string().optional(),

  billing_firstName: z.string().min(1, "Required").max(50, "Too long."),
  billing_address1: z.string().min(1, "Required").max(150, "Too long."),
  billing_address2: z.string().min(1, "Required").max(150, "Too long."),
  billing_phone: z.string().min(6, "Required"),
  billing_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  billing_city: z.string().min(1, "Required").max(150, "Too long."),
  billing_state: z.string().min(1, "Required").max(150, "Too long."),
  billing_gst: z
    .string()
    .min(15, "The GST number must be 15 digits.")
    .max(15, "The GST number must be 15 digits."),
  gstInvoice: z.literal(true),
})

export type BothAddressProps = z.infer<typeof BothAddress>

export const AddressSchema = z.discriminatedUnion("gstInvoice", [
  ShippingSchema,
  BothAddress,
])

export type AddressSchemaProps = z.infer<typeof AddressSchema>

export const checkPincodeSchema = z.object({
  pincode: z.string().min(6).max(6),
  addressType: z.enum(["Shipping", "billing"]),
})

export type CheckPincodeSchemaProps = z.infer<typeof checkPincodeSchema>
