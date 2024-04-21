export const pageRoutes = {
  home: "/",
  shop: "/shop",
  cart: "/cart",
  checkout: "/checkout/payment",
  address: "checkout/address",
  "404": "/404",
} as const

export type PageRoute = keyof typeof pageRoutes
