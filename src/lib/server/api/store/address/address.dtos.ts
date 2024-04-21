import { z } from "zod"

export const AddressDTO = z.object({
  firstName: z.string().min(1, "Required").max(50, "Too long."),
  lastName: z.string().min(1, "Required").max(50, "Too long."),
  address1: z.string().min(1, "Required").max(150, "Too long."),
  address2: z.string().min(1, "Required").max(150, "Too long."),
  phone: z.string().min(6, "Required"),
  postcode: z.string().min(6, "Incorrect").max(50, "Incorrect"),
  city: z.string().min(1, "Required").max(150, "Too long."),
  state: z.string().min(1, "Required").max(150, "Too long."),
  country: z.string().min(1, "Required").max(150, "Too long."),
  otp: z.string().optional(),
  token: z.string().optional(),
})

export type AddressDTOType = z.infer<typeof AddressDTO>

export const checkPincodeDTO = z.object({
  pincode: z.string().min(6).max(6),
})

export type CheckPincodeDTOType = z.infer<typeof checkPincodeDTO>
