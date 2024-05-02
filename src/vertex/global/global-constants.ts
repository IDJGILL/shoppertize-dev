export const pathList = ["/", "/cart"] as const

export const cacheTagList = ["some"] as const

export const metaKeys = ["address-options"] as const

export const redisPrefixList = [
  "@cache/product",
  "@session/auth",
  "@session/address",
  "@verify/auth",
  "@verify/address",
  "@data/postcode",
  "@data/coupons",
] as const

export const courierTrackingStatusCodes = ["PP", "IT", "OFD", "DL"] as const

export const courierTrackingStatusLabels = ["Pending Pickup", "In Transit", "Out For Delivery", "Delivered"] as const
