/**
 *  *** Standardized Global Types ***
 * The properties of the types *shell not be changed or update
 */

import { type AddressDataItem } from "../modules/address/address-types"

/**
 * Auth Session Types
 */
export type AuthSession = {
  uid: number
  name: string
  username: string
  loggedInAt: string
  expireAt: string
  currentAddress: AddressDataItem | null
}

export type AuthClientSession = {
  user?: {
    id: string
    name: string
    email: string
  }
  isLoading: boolean
  isLoggedIn: boolean
}

export type Authentication = {
  id: string
  ip: string
  expiry: number
  createdAt: number
  isVerified: boolean
  username: string
  verification: "otp" | "link"
  action: "login" | "signup" | "reset"
  resendCount: number
  secret: string
  countryCode: string
  clientId: string
}

export type Address = {
  id: string
  shipping: {
    firstName: string
    lastName: string
    address1: string
    address2: string
    phone: string
    postcode: string
    city: string
    state: string
    email: string
    country: string
    isDefault: boolean
  }
  billing: {
    company: string
    address1: string
    address2: string
    phone: string
    postcode: string
    city: string
    state: string
    taxNumber: string
  } | null
}

export type Shipping = ShippingItem[]

export type ShippingItem = {
  charge: FixedCharge | PercentageCharge
  exclude: [""]
  include: [""]
  free?: {
    min?: 1000
    max?: 2000
  }
}

export type FixedCharge = {
  type: "fixed"
  amount: number
}

export type PercentageCharge = {
  type: "percentage"
  amount: number
  max: number
}
