import { type Shipping } from "../modules/address/address-models"
import type { cacheTagList, pathList, redisIDPrefixList } from "./global-constants"

export type Path = (typeof pathList)[number]

export type CacheTag = (typeof cacheTagList)[number]

export type RedisIDPrefix = (typeof redisIDPrefixList)[number]

//
//
//
//
//
//

// Todo - Work on this

/**
 * Auth Session Types
 */
export type AuthSession = {
  uid: string
  name: string
  username: string
  loggedInAt: string
  expireAt: string
  currentAddress: Shipping | null
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

// export type Shipping = ShippingItem[]

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
