import { type ReactNode } from "react"

export const authNavigations = {
  static: {
    login: {
      label: (label?: string | ReactNode) => label ?? "Login",
      path: "/login",
    },
  },
} as const

export const accountNavigations = {
  static: {
    account: {
      label: (label?: string | ReactNode) => label ?? "Account",
      path: "/account",
    },
    profile: {
      label: (label?: string | ReactNode) => label ?? "Profile",
      path: "/account/profile",
    },
    wallet: {
      label: (label?: string | ReactNode) => label ?? "Wallet",
      path: "/account/wallet",
    },
    address: {
      label: (label?: string | ReactNode) => label ?? "Address",
      path: "/account/address",
    },
    buyagain: {
      label: (label?: string | ReactNode) => label ?? "Buy Again",
      path: "/account/buyagain",
    },
    orders: {
      label: (label?: string | ReactNode) => label ?? "Orders",
      path: "/account/orders",
    },
    wishlist: {
      label: (label?: string | ReactNode) => label ?? "Wishlist",
      path: "/account/wishlist",
    },
  },
  dynamic: {
    order: {
      label: (label?: string | ReactNode) => label ?? "Order",
      path: (id: string) => `/account/orders/${id}`,
    },
    addReview: {
      label: (label?: string | ReactNode) => label ?? "Add Review",
      path: (id: string) => `/account/orders/${id}?review=new`,
    },
    reviewSuccess: {
      label: (label?: string | ReactNode) => label ?? "Review Success",
      path: (id: string) => `/account/orders/${id}?review=success`,
    },
  },
} as const

export const storeNavigations = {
  static: {
    cart: {
      label: (label?: string | ReactNode) => label ?? "Cart",
      path: "/cart",
    },
    payment: {
      label: (label?: string | ReactNode) => label ?? "Payment",
      path: "/checkout/payment",
    },
    address: {
      label: (label?: string | ReactNode) => label ?? "Address",
      path: "/checkout/address",
    },
  },
  dynamic: {
    shop: {
      label: (label?: string | ReactNode) => label ?? "Shop",
      path: (categoryName: string) => `/shop/${categoryName}`,
    },
    product: {
      label: (label?: string | ReactNode) => label ?? "Product",
      path: (slug: string) => `/product/${slug}`,
    },
    productVariant: {
      label: (label?: string | ReactNode) => label ?? "Product Variant",
      path: (slug: string, variationId: string) =>
        `/product/${slug}?variant=${variationId}`,
    },
  },
} as const
