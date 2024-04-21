export type Coupon = CouponTodo

export type CouponUsedBy = {
  id: string
  email: string
}

export type SortedCoupon = Coupon & {
  isEligible: boolean
  eligibilityMessage?: string
}
