import { authAction } from "~/vertex/lib/server/server-action-helpers"
import { $CouponCode } from "./coupon-schemas"
import { getCoupon } from "./coupon-server-utils"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import { getCartItemData } from "../cart/cart-server-utils"

export const couponApplyAction = authAction($CouponCode, async (input) => {
  const coupon = await getCoupon(input.code).catch(() => {
    throw new ExtendedError({ code: "NOT_FOUND", message: "Coupon not found." })
  })

  if (coupon.code.toLowerCase() !== input.code.toLowerCase()) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: "Invalid coupon code." })
  }

  const cart = await getCartItemData()

  // if dateExpiry is enabled, then check if coupon expired
  // if emailRestrictions is enabled, then check if user email is allowed.
  // if usageLimit is enabled, then check if it exceeded
  // if usageLimitPerUser is enabled, then check if it exceeded
  // if productCategories is enabled, then check if is exists in the cart.
  // if excludedProductCategories is enabled, then check if is exists in the cart.
  // if products is enabled, then check if is exists in the cart.
  // if excludedProducts is enabled, then check if is exists in the cart.
  const conditions = {
    //   dateExpiry: "2024-05-31T18:30:00+00:00",
    //   emailRestrictions: ["inderjeetgill.me@gmail.com"],
    //   usageCount: 0,
    //   usageLimit: 100,
    //   usageLimitPerUser: 1,
    //   productCategories: [],
    //   excludedProductCategories: [],
    //   products: [],
    //   excludedProducts: [],
  }
})
