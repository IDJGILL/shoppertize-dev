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
import { authAction, publicAction } from "~/vertex/lib/action"
import { signIn, signOut } from "~/vertex/lib/auth/config"
import { $CartItem } from "../../modules/cart/cart-schemas"
import { removeCartItemFromCookie, updateCartItemToCookie } from "../../modules/cart/cart-server-utils"
import { $Revalidate } from "~/vertex/global/models"
import { revalidatePath, revalidateTag } from "next/cache"
import { paths, tags } from "~/vertex/global/paths-and-tags"
import { checkoutHandler } from "~/vertex/modules/checkout/checkout-controllers"
import { $PaymentMethod } from "~/lib/modules/payment/payment-models"
import { addressHandler } from "~/vertex/modules/address/address-controllers"
import { $Address, $AddressOtpToken } from "~/vertex/modules/address/address-models"
import otpless from "../otpless/config"
import { ExtendedError } from "~/vertex/utils/extended-error"
import { $IndianPostcode } from "~/vertex/modules/courier/courier-models"
import { checkPostcodeService } from "~/vertex/modules/courier/courier-controllers"

// Todo - Create password schema logic.
// Todo - Test @hapi/iron package in edge environment.
// Todo - Add JsDocs
// Todo - Add Options query to conditionally display login options to the users.
// Todo - Add a TTL to user login and its session.

export const revalidate = publicAction($Revalidate, async (input) => {
  return await new Promise<boolean>((resolve) => {
    const isPathExist = input.paths.some((a) => paths.includes(a))

    const isTagExist = input.tags.some((a) => tags.includes(a))

    if (isPathExist) {
      input.paths.forEach((path) => revalidatePath(path))
    }

    if (isTagExist) {
      input.tags.forEach((tag) => revalidateTag(tag))
    }

    return resolve(true)
  })
})

export const identify = publicAction($Identify, async (input) => {
  return await identifyUser(input)
})

export const verify = publicAction($Verify, async (input) => {
  return await verifyUser(input)
})

export const resend = publicAction($AuthSessionId, async (input) => {
  return await resendVerify(input)
})

export const login = publicAction($Login, async (input) => {
  return await loginUser(input)
})

export const socialLogin = publicAction($Social, async (input) => {
  return await signIn(input)
})

export const signup = publicAction($Signup, async (input) => {
  return await signUpUser(input)
})

export const forget = publicAction($ForgetPassword, async (input) => {
  return await forgetPassword(input)
})

export const update = publicAction($UpdatePassword, async (input) => {
  return await updatePassword(input)
})

export const authStatus = publicAction($AuthSessionId, async (input) => {
  return await checkVerification(input)
})

export const logout = publicAction($Null, async (...props) => {
  await signOut({ redirect: false })

  return props[1].response.success({
    data: null,
    message: "Logged out successfully",
  })
})

export const updateQuantity = publicAction($CartItem, async (input, ctx) => {
  await updateCartItemToCookie(input)

  return ctx.response.success({
    data: true,
    message: "Quantity updated",
  })
})

export const removeItem = publicAction($CartItem, async (input, ctx) => {
  await new Promise((resolve) => resolve(removeCartItemFromCookie(input)))

  return ctx.response.success({
    data: true,
    revalidatePaths: ["/cart"],
  })
})

export const checkoutAction = authAction($PaymentMethod, async (input) => {
  return await checkoutHandler(input)
})

export const addressHandlerAction = authAction($Address, async (input, ctx) => {
  return await addressHandler(input, ctx.session.authToken)
})

// export const updateAddressAction = authAction($Address, async (input, ctx) => {
//   return updateAddress(input, ctx.session.authToken)
// })

export const resendAddressOtpAction = authAction($AddressOtpToken, async (input) => {
  const data = await otpless.resend(input)

  if (!data.newToken) throw new ExtendedError({ code: "BAD_REQUEST", message: data.message })

  return data.newToken
})

export const checkPostcodeAction = authAction($IndianPostcode, async (input) => {
  return await checkPostcodeService(input)
})