import { z } from "zod"

export const EmailOtpSchema = z.object({
  otp: z.string().optional(),
  token: z.string().optional(),
})

export const $Shipping = z.object({
  address_id: z.string().min(1, "Required").max(50, "Too long."),
  shipping_firstName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_lastName: z.string().min(1, "Required").max(50, "Too long."),
  shipping_address1: z.string().min(1, "Required").max(150, "Too long."),
  shipping_address2: z.string().min(1, "Required").max(150, "Too long."),
  shipping_phone: z.string().min(6, "Required"),
  shipping_postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  shipping_city: z.string().min(1, "Required").max(150, "Too long."),
  shipping_state: z.string().min(1, "Required").max(150, "Too long."),
  shipping_country: z.string().min(1, "Required").max(150, "Too long."),
  addressType: z.enum(["home", "office", "other"]),
  isTaxInvoice: z.literal(false),
  isDefault: z.boolean().default(false),

  otp: z.string().optional(),
  token: z.string().optional(),
})

const $ShippingVerify = z.object({
  otp: z.string().min(1, "Please enter otp"),
  token: z.string().min(1, "Something went wrong, Please refresh the page and try again."),
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

export const $Address = z
  .discriminatedUnion("isTaxInvoice", [$Shipping, $Shipping.merge($Billing)])
  .superRefine((input, ctx) => {
    if (!!input.token) {
      const result = $ShippingVerify.safeParse({ otp: input.otp, token: input.token })

      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otp"],
          message: "Please enter your otp",
        })

        return false
      }
    }

    return true
  })

export type Address = z.infer<typeof $Address>

export const $Postcode = z.object({
  postcode: z.string().min(6).max(6),
  addressType: z.enum(["Shipping", "billing"]),
})

export type Postcode = z.infer<typeof $Postcode>

export const $AddressOtpToken = z.string().min(2)

export type AddressOtpToken = z.infer<typeof $AddressOtpToken>
