import { z } from "zod"

export const EmailOtpSchema = z.object({
  otp: z.string().optional(),
  token: z.string().optional(),
})

export const $Shipping = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Required").max(50, "Too long."),
  address: z.string().min(1, "Required").max(150, "Too long."),
  locality: z.string().min(1, "Required").max(150, "Too long."),
  city: z.string().min(1, "Required").max(150, "Too long."),
  state: z.string().min(1, "Required").max(150, "Too long."),
  phone: z.string().min(10, "Required").max(15, "Incorrect phone number"),
  postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  country: z.string().max(150, "Too long."),
  saveAs: z.enum(["home", "office", "other"], {
    errorMap: (e) => {
      return { message: "Please select from options above." }
    },
  }),
  isDefault: z.boolean().default(false),
})

export type Shipping = z.infer<typeof $Shipping>

export const $Billing = z.object({
  firstName: z.string().min(1, "Required").max(50, "Too long."),
  address1: z.string().min(1, "Required").max(150, "Too long."),
  address2: z.string().min(1, "Required").max(150, "Too long."),
  phone: z.string().min(6, "Required"),
  postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  city: z.string().min(1, "Required").max(150, "Too long."),
  state: z.string().min(1, "Required").max(150, "Too long."),
  country: z.string().max(150, "Too long."),
  tax: z.string().min(15, "The number must be 15 digits.").max(15, "The number must be 15 digits."),
})

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
