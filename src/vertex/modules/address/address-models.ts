import { z } from "zod"

export const EmailOtpSchema = z.object({
  otp: z.string().optional(),
  token: z.string().optional(),
})

export const $Shipping = z.object({
  shipping_firstName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_lastName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_address1: z.string().min(1, "Required").max(150, "Too long."),
  shipping_address2: z.string().min(1, "Required").max(150, "Too long."),
  shipping_city: z.string().min(1, "Required").max(150, "Too long."),
  shipping_state: z.string().min(1, "Required").max(150, "Too long."),
  shipping_phone: z.string().min(6, "Required"),
  shipping_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  shipping_country: z.string().max(150, "Too long."),

  addressId: z.string().optional(),
  addressType: z.enum(["home", "office", "other"]),
  isTaxInvoice: z.literal(false),
  isDefault: z.boolean().default(false),
})

export type Shipping = z.infer<typeof $Shipping>

export const $Billing = z.object({
  billing_firstName: z.string().min(1, "Required").max(50, "Too long."),
  billing_address1: z.string().min(1, "Required").max(150, "Too long."),
  billing_address2: z.string().min(1, "Required").max(150, "Too long."),
  billing_phone: z.string().min(6, "Required"),
  billing_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  billing_city: z.string().min(1, "Required").max(150, "Too long."),
  billing_state: z.string().min(1, "Required").max(150, "Too long."),
  billing_country: z.string().min(1, "Required").max(150, "Too long."),
  billing_tax: z.string().min(15, "The number must be 15 digits.").max(15, "The number must be 15 digits."),

  isTaxInvoice: z.literal(true),
})

export const $Address = z.discriminatedUnion("isTaxInvoice", [$Shipping, $Shipping.merge($Billing)])

export type Address = z.infer<typeof $Address>

export const $Postcode = z.object({
  postcode: z.string().min(6).max(6),
  addressType: z.enum(["Shipping", "billing"]),
})

export type Postcode = z.infer<typeof $Postcode>

export const $AddressVerification = z.object({
  id: z.string(),
  otp: z.string(),
})

export type AddressVerification = z.infer<typeof $AddressVerification>
