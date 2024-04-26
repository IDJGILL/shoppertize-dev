"use server"

import {
  $AuthSessionId,
  $ForgetPassword,
  $Identify,
  $Login,
  $Null,
  $Signup,
  $Social,
  $UpdatePassword,
  $Verify,
} from "../../modules/auth/auth-models"
import {
  checkVerification,
  forgetPassword,
  identifyUser,
  loginUser,
  resendVerify,
  signUpUser,
  updatePassword,
  verifyUser,
} from "../../modules/auth/auth-controllers"
import { authAction, publicAction, revalidate } from "~/vertex/lib/server/server-action-helpers"
import { signIn, signOut } from "~/vertex/lib/auth/auth-config"
import { $CartItem } from "../../modules/cart/cart-schemas"
import { removeCartItemFromCookie, updateCartItemToCookie } from "../../modules/cart/cart-server-utils"
import { $Revalidate } from "~/vertex/global/global-models"
import { checkoutHandler } from "~/vertex/modules/checkout/checkout-controllers"
import { $PaymentMethod } from "~/lib/modules/payment/payment-models"
import {
  addressHandler,
  changeAddress,
  deleteAddress,
  verifyAddress,
} from "~/vertex/modules/address/address-controllers"
import { $AddressVerification, $Shipping } from "~/vertex/modules/address/address-models"
import otpless from "../otpless/otpless-config"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { $IndianPostcode } from "~/vertex/modules/courier/courier-models"
import { checkPostcodeService } from "~/vertex/modules/courier/courier-controllers"
import { z } from "zod"
import { redisGet, redisMerge } from "../redis/redis-utils"
import { type VerifyAddress } from "~/vertex/modules/address/address-types"

// Todo - Create password schema logic.
// Todo - Test @hapi/iron package in edge environment.
// Todo - Add JsDocs
// Todo - Add Options query to conditionally display login options to the users.
// Todo - Add a TTL to user login and its session.

export const revalidateAction = publicAction($Revalidate, async (input) => {
  return await revalidate(input)
})

export const authIdentifyAction = publicAction($Identify, async (input) => {
  return await identifyUser(input)
})

export const authVerifyAction = publicAction($Verify, async (input) => {
  return await verifyUser(input)
})

export const authResendAction = publicAction($AuthSessionId, async (input) => {
  return await resendVerify(input)
})

export const authLoginActon = publicAction($Login, async (input) => {
  return await loginUser(input)
})

export const authSocialLoginAction = publicAction($Social, async (input) => {
  return await signIn(input)
})

export const authSignupAction = publicAction($Signup, async (input) => {
  return await signUpUser(input)
})

export const authForgetAction = publicAction($ForgetPassword, async (input) => {
  return await forgetPassword(input)
})

export const authUpdateAction = publicAction($UpdatePassword, async (input) => {
  return await updatePassword(input)
})

export const authStatusAction = publicAction($AuthSessionId, async (input) => {
  return await checkVerification(input)
})

export const authLogoutAction = publicAction($Null, async (...props) => {
  await signOut({ redirect: false })

  return props[1].response.success({
    data: null,
    message: "Logged out successfully",
  })
})

export const cartQuantityAction = publicAction($CartItem, async (input, ctx) => {
  await updateCartItemToCookie(input)

  return ctx.response.success({
    data: true,
    message: "Quantity updated",
  })
})

export const cartRemoveAction = publicAction($CartItem, async (input, ctx) => {
  await new Promise((resolve) => resolve(removeCartItemFromCookie(input)))

  return ctx.response.success({
    data: true,
    revalidatePaths: ["/cart"],
  })
})

export const checkoutAction = authAction($PaymentMethod, async (input) => {
  return await checkoutHandler(input)
})

export const addressAction = authAction($Shipping, async (input, ctx) => {
  const data = await addressHandler(ctx.session.user.id, input)

  return ctx.response.success({
    data: data,
    revalidatePaths: ["/cart"],
  })
})

export const addressVerifyAction = authAction($AddressVerification, async (input, ctx) => {
  return await verifyAddress({ ...input, uid: ctx.session.user.id })
})

export const addressResendAction = authAction(z.string(), async (input) => {
  const session = await redisGet<VerifyAddress>({ id: input, idPrefix: "@verify/address" })

  if (!session) {
    throw new ExtendedError({ code: "BAD_REQUEST", message: "Limit reached, please refresh the page and try again." })
  }

  const data = await otpless.resend(session.token)

  if (!data.newToken) throw new ExtendedError({ code: "BAD_REQUEST", message: data.message })

  await redisMerge({ previous: session, idPrefix: "@verify/address", payload: { token: data.newToken } })
})

export const addressPostcodeAction = authAction($IndianPostcode, async (input) => {
  return await checkPostcodeService(input)
})

export const addressChangeAction = authAction(z.string(), async (input, ctx) => {
  await changeAddress(ctx.session.user.id, input)

  return revalidate({ paths: ["/cart"] })
})

export const addressDeleteAction = authAction(z.string(), async (input, ctx) => {
  await deleteAddress(ctx.session.user.id, input)

  return revalidate({ paths: ["/cart"] })
})
