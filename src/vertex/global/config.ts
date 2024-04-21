export const config = {
  authentication: {
    retryInSec: 60,
    otpLength: 4,
    secretExpiryInSec: 3 * 60,
    maxResend: 3,
    ttl: 5 * 60,
    general: {
      otp: true,
      email: true,
    },
  },
  payment: {
    codCharges: {
      type: "percentage",
      amount: 2.4,
    },
  },
  courier: {
    originPincode: "122017",
  },
  cart: {
    maxProductQuantity: 10,
  },
  authRoutes: ["/login"],
  protectedRoutes: ["/account", "/checkout"],
}
