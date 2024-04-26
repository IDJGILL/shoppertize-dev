import { type Shipping } from "./address-models"

export type VerifyAddress = {
  address: Shipping
  token: string
  action: "add" | "update"
}

export type AddAddress = {
  uid: string
  options: Shipping[]
  input: Shipping
}

export type VerifyAddressProps = {
  id: string
  uid: string
  otp: string
}

export type AddressSession = {
  options: Shipping[]
}
