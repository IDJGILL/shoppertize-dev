import { authAction } from "~/vertex/lib/server/server-action-helpers"
import { $CouponCode } from "./coupon-schemas"
import { getCoupon } from "./coupon-server-utils"
import { ExtendedError } from "~/vertex/lib/utils/extended-error"
import { getCartItemData } from "../cart/cart-server-utils"
import { authQuery } from "~/vertex/lib/server/server-query-helper"
import { $Null } from "../auth/auth-models"

export const couponApplyAction = authAction($CouponCode, async (input) => {
  const coupon = await getCoupon(input.code).catch(() => {
    throw new ExtendedError({ code: "NOT_FOUND", message: "Coupon not found." })
  })

  if (coupon.code.toLowerCase() !== input.code.toLowerCase()) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: "Invalid coupon code." })
  }

  const cart = await getCartItemData()
})

export const queryCoupons = authQuery($Null, async (input) => {})
