export const CHECK_APPLIED_COUPONS = `
query CHECK_APPLIED_COUPONS {
  cart {
    total(format: RAW)
    appliedCoupons {
      code
      discountAmount(format: RAW)
    }
  }
}
`

export const REMOVE_COUPONS = `
mutation REMOVE_COUPONS($codes: [String]) {
  removeCoupons(input: {codes: $codes}) {
    cart {
      total(format: RAW)
    }
  }
}
`

export const GET_COUPONS = `
query GET_COUPONS {
  coupons {
    nodes {
      id
      amount
      code
      dateExpiry
      description
      discountType
      individualUse
      maximumAmount
      minimumAmount
      usageLimitPerUser
      usageLimit
      freeShipping
      usageCount
      productCategories {
        nodes {
          slug
        }
      }
      emailRestrictions
    }
  }
}
`

export const GET_COUPON_BY_CODE = `
query GET_COUPON_BY_CODE($id: ID = "") {
  coupon(idType: CODE, id: $id) {
    id
    amount
    code
    dateExpiry
    description
    discountType
    individualUse
    maximumAmount
    minimumAmount
    usageLimitPerUser
    usageLimit
    freeShipping
    usageCount
    productCategories {
      nodes {
        slug
      }
    }
    emailRestrictions
  }
}
`

export const APPLY_COUPON = `
mutation APPLY_COUPON($code: String = "") {
  applyCoupon(input: {code: $code}) {
    applied {
      code
      discountAmount(format: RAW)
    }
    cart {
      total(format: RAW)
    }
  }
}
`

export const CART_SESSION_DATA = `
query CART_SESSION_DATA {
  customer {
    metaData {
      id
      key
      value
    }
    session {
      id
      key
      value
    }
  }
  cart(recalculateTotals: true) {
    contents {
      nodes {
        ... on SimpleCartItem {
          key
          quantity
          product {
            node {
              productSettings {
                hasCashOnDelivery
                hasReturnExchange
                allowedShippingPincodes
                allowedShippingStates
              }
              ... on SimpleProduct {
                id
                name
                regularPrice(format: RAW)
                salePrice(format: RAW)
                stockStatus
                stockQuantity
                image {
                  sourceUrl
                }
                productCategories {
                  nodes {
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`
