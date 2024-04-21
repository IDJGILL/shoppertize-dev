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
} from "./auth-models"
import {
  checkVerificationController,
  forgetPasswordController,
  identifyUserController,
  loginUserController,
  resendVerifyController,
  signUpUserController,
  updatePasswordController,
  verifyUserController,
} from "./auth-controllers"
import { publicAction } from "~/vertex/lib/action"
import { signIn, signOut } from "~/vertex/lib/auth/config"

// Todo - Create password schema logic.
// Todo - Test @hapi/iron package in edge environment.
// Todo - Add JsDocs

export const identify = publicAction($Identify, async (input) => {
  return await identifyUserController(input)
})

export const verify = publicAction($Verify, async (input) => {
  return await verifyUserController(input)
})

export const resend = publicAction($AuthSessionId, async (input) => {
  return await resendVerifyController(input)
})

export const login = publicAction($Login, async (input) => {
  return await loginUserController(input)
})

export const socialLogin = publicAction($Social, async (input) => {
  return await signIn(input)
})

export const signup = publicAction($Signup, async (input) => {
  return await signUpUserController(input)
})

export const forget = publicAction($ForgetPassword, async (input) => {
  return await forgetPasswordController(input)
})

export const update = publicAction($UpdatePassword, async (input) => {
  return await updatePasswordController(input)
})

export const authStatus = publicAction($AuthSessionId, async (input) => {
  return await checkVerificationController(input)
})

export const logout = publicAction($Null, async (...props) => {
  await signOut({ redirect: false })

  return props[1].response.success({
    data: null,
    message: "Logged out successfully",
  })
})
