// type CartProduct = {
//   type: ProductType
// } & (SimpleCartProduct | VariableCartProduct)

// type SimpleCartProduct = {
//   id: string
//   type: "SIMPLE"
//   name: string
//   image: ProductImage
//   price: string
//   regularPrice: string
//   stockQuantity: number
//   stockStatus: StockStatus
//   taxClass: string
//   taxStatus: "TAXABLE"
//   productSettings: {
//     allowedShippingPincodes: string | null
//     allowedShippingStates: string | null
//   }
// }

// type VariableCartProduct = {
//   id: string
//   type: "VARIABLE"
//   attributes: {
//     nodes: Attribute[]
//   }
//   variations: {
//     nodes: CartVariation[]
//   }
// }

// type CartVariation = {
//   id: string
//   type: "VARIATION"
//   name: string
//   image: ProductImage
//   price: string
//   regularPrice: string
//   attributes: {
//     nodes: VariationAttribute[]
//   }
//   stockQuantity: number
//   stockStatus: StockStatus
//   taxClass: string
//   taxStatus: "TAXABLE"
// }

// type UserCartProduct = {
//   key: string
//   quantity: number
// } & (SimpleUserCartProduct | VariationUserCartProduct)

// type SimpleUserCartProduct = {
//   product: {
//     node: SimpleCartProduct
//   }
//   variation: null
// }

// type VariationUserCartProduct = {
//   product: {
//     node: VariableCartProduct
//   }
//   variation: {
//     node: {
//       id: string
//       stockQuantity: number
//       stockStatus: StockStatus
//       taxClass: string
//       taxStatus: "TAXABLE"
//     }
//   }
// }

// type AppliedCoupon = {
//   code: string
//   discountAmount: string
//   date: string
// }

// type ProductImage = {
//   sourceUrl: string
// }

// type StockStatus = "IN_STOCK" | "ON_BACKORDER" | "OUT_OF_STOCK"

// type Attribute = {
//   id: string
//   name: string
//   label: string
//   options: string[]
//   variation: boolean
//   visible: boolean
// }

// type VariationAttribute = {
//   id: string
//   label: string
//   name: string
//   value: string
// }

// type ProductType = "SIMPLE" | "VARIABLE"

// type MergeQueryItem = {
//   quantity: number
// } & (
//   | {
//       product: {
//         node: {
//           id: string
//           stockQuantity: number
//           stockStatus: StockStatus
//           taxClass: string
//           taxStatus: "TAXABLE"
//         }
//       }
//       variation: null
//     }
//   | {
//       product: {
//         node: {
//           id: string
//           stockQuantity: number
//           stockStatus: StockStatus
//           taxClass: string
//           taxStatus: "TAXABLE"
//         }
//       }
//       variation: {
//         node: {
//           id: string
//           stockQuantity: number
//           stockStatus: StockStatus
//           taxClass: string
//           taxStatus: "TAXABLE"
//         }
//       }
//     }
// )

// type UserCartItemRecord = {
//   productId: number
//   quantity: number
// }

// type SyncedCartItemsInput = {
//   keys: string[]
//   isAll: boolean
// }

// type UpdateSyncedItemQuantityInput = {
//   key: string
//   quantity: number
// }

// type SyncedItem = {
//   parentDataBaseId: number
//   requestedQuantity: number
//   authToken: string
// }

// type StockProduct = {
//   id: string
//   type: ProductType
// } & (SimpleStockProduct | VariableStockProduct)

// type SimpleStockProduct = {
//   type: "SIMPLE"
//   databaseId: number
//   stockQuantity: number
//   stockStatus: StockStatus
// }

// type VariableStockProduct = {
//   type: "VARIABLE"
//   variations: {
//     nodes: StockVariation[]
//   }
// }

// type StockVariation = {
//   id: string
//   databaseId: number
//   stockQuantity: number
//   stockStatus: StockStatus
// }

// type ReplaceItem = {
//   id: string
//   key: string
//   quantity: number
//   currentBaseAttribute: VariationAttribute
//   selectedAttribute: VariationAttribute
// }

// type UpdateQuantityInputProps = {
//   key: string
//   quantity: number
// }

// type CartItemErrorType = "shipping_error" | "quantity_error" | "stock_error"

// type CartItemError = {
//   type: CartItemErrorType
//   message: string
// }

// type SimpleCartItem = {
//   id: string
//   key: string
//   type: "SIMPLE"
//   name: string
//   image: ProductImage
//   price: string
//   regularPrice: string
//   quantity: number
//   quantityOptions: QuantityOptions[]
//   hasSelectedQuantity: boolean
//   stockQuantity: number
//   stockStatus: StockStatus
//   tax: number
// }

// type VariationCartItem = {
//   id: string
//   key: string
//   type: "VARIATION"
//   name: string
//   image: ProductImage
//   price: string
//   regularPrice: string
//   quantity: number
//   isInStock: boolean
//   quantityOptions: QuantityOptions[]
//   hasSelectedQuantity: boolean
//   hasSelectedVariant: boolean
//   attributes: {
//     nodes: VariationAttribute[]
//   }
//   variantOptions: CartSubVariationOption[] | null
//   selectedVariant: string | null
//   stockQuantity: number
//   stockStatus: StockStatus
//   tax: number
// }

// type QuantityOptions = {
//   id: string
//   name: number
//   label: number
//   value: number
//   isActive: boolean
// }

// type CartSubVariationOption = {
//   id: string
//   name: string
//   value: string
//   isInStock: boolean
//   isActive: boolean
// }

// // type CartSummary = {
// //   subtotal: string;
// //   subtotal_tax: string;
// //   shipping_total: string;
// //   shipping_tax: string;
// //   shipping_taxes: [];
// //   discount_total: string;
// //   discount_tax: string;
// //   cart_contents_total: string;
// //   cart_contents_tax: string;
// //   cart_contents_taxes: [];
// //   fee_total: string;
// //   fee_tax: string;
// //   fee_taxes: [];
// //   total: string;
// //   total_tax: string;
// // };

// type FormattedSummary = {
//   [key in keyof Summary]: string
// }

// type SummaryProps = {
//   type: "OFFLINE" | "ONLINE"
// } & (OfflineSummaryProps | OnlineSummaryProps)

// type OfflineSummaryProps = {
//   type: "OFFLINE"
//   cartItems: CartItem[]
// }

// type OnlineSummaryProps = {
//   type: "ONLINE"
//   cartContents: CartSessionItem[]
//   appliedCoupon: CouponTodo | null
//   appliedWalletBalance: number | null
//   contentsTotal: string
//   discountTotal: string
//   shippingTotal: string
//   subtotal: string
//   total: string
// }

// // Todo - Remove
// type CouponTodo = {
//   id: string
//   amount: number
//   code: string
//   dateExpiry: string
//   description: string
//   discountType: "FIXED_CART" | "PERCENT"
//   individualUse: boolean
//   minimumAmount: number | null
//   maximumAmount: number | null
//   usageLimitPerUser: number | null
//   usageLimit: number | null
//   freeShipping: boolean
//   usageCount: number
//   productCategories: {
//     nodes: {
//       slug: string
//     }[]
//   }
//   emailRestrictions: string[] | null
// }

// // type Summary = {
// //   type: "OFFLINE" | "ONLINE"
// // } & (OfflineSummary | OnlineSummary)

// type OfflineSummary = {
//   type: "OFFLINE"
//   mrpTotal: number
//   cartDiscount: number
//   subtotal: number
//   total: number
// }

// type OnlineSummary = {
//   type: "ONLINE"
//   mrpTotal: number
//   cartDiscount: number
//   coupon: CalculatedDiscount | null
//   walletTotal: number | null
//   shippingTotal: number | null
//   subtotal: number
//   oldTotal: number
//   finalTotal: number
//   codCharges: number
// }

// type CalculatedDiscount = {
//   couponDiscount: number
//   couponCode: string
//   type: CouponTodo["discountType"]
// }

// type SessionCartItem = {
//   key: string
//   product_id: number
//   variation_id: number
//   variation: {
//     attribute_pa_color: string
//     attribute_pa_size: string
//   }
//   quantity: number
//   line_subtotal: number
//   line_total: number
// }

// type SessionCartItemRecord = Record<string, SessionCartItem>
