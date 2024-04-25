import { env } from "~/env.mjs"
import jwt from "~/lib/utils/functions/jwt"
import { compareText } from "~/vertex/utils/compare-text"

const otpless = {
  send: async (phone: string): Promise<{ token: string }> => {
    const response = await fetch(`https://auth.otpless.app/auth/otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientId: env.OTP_LESS_CLIENT_ID,
        clientSecret: env.OTP_LESS_CLIENT_SECRET,
      },
      body: JSON.stringify({
        sendTo: phone,
        otpLength: 4,
        channel: "SMS",
      }),
      cache: "no-cache",
    }).then(async (res) => {
      const data = (await res.json()) as {
        orderId: string
        message?: string
      }

      const token = await jwt.sign({
        payload: {
          id: data.orderId,
          phone: phone,
        },
        secret: env.AUTH_SECRET,
        secretSuffix: phone + data.orderId,
        expiresIn: "2m",
      })

      return {
        token,
      }
    })

    return response
  },
  resend: async (token: string): Promise<{ newToken?: string; message: string }> => {
    const payload = jwt.decode.parse<{
      id: string
      phone: string
      action: "login" | "signup"
    }>(token)

    const response = await fetch(`https://auth.otpless.app/auth/otp/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientId: env.OTP_LESS_CLIENT_ID,
        clientSecret: env.OTP_LESS_CLIENT_SECRET,
      },
      body: JSON.stringify({
        orderId: payload.id,
      }),
      cache: "no-cache",
    })
      .then(async (res) => {
        const data = (await res.json()) as {
          orderId?: string
          message: string
        }

        const limitReached = compareText(data.message, "3 times")

        if (limitReached) {
          return {
            message: "Limit reached, please refresh the page and try again.",
          }
        }

        if (!data.orderId) {
          return {
            message: "Something went wrong",
          }
        }

        const newToken = await jwt.sign({
          payload: {
            id: payload.id,
            phone: payload.phone,
            action: payload.action,
          },
          secret: env.AUTH_SECRET,
          secretSuffix: payload.phone + payload.id,
          expiresIn: "2m",
        })

        return {
          newToken: newToken,
          message: "OTP sent again.",
        }
      })
      .catch(() => {
        return {
          message: "Something went wrong",
        }
      })

    return response
  },
  verify: async (token: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const payload = jwt.decode.parse<{
      id: string
      phone: string
    }>(token)

    const isValidToken = await jwt.verify.safeParse<{
      id: string
      phone: string
    }>({
      token: token,
      secret: env.AUTH_SECRET,
      secretSuffix: payload.phone + payload.id,
    })

    if (!isValidToken) {
      return {
        success: false,
        message: "Otp Expired",
      }
    }

    const response = await fetch(`https://auth.otpless.app/auth/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientId: env.OTP_LESS_CLIENT_ID,
        clientSecret: env.OTP_LESS_CLIENT_SECRET,
      },
      body: JSON.stringify({
        orderId: isValidToken.id,
        otp: otp,
        sendTo: isValidToken.phone,
      }),
      cache: "no-cache",
    })
      .then(async (res) => {
        const data = (await res.json()) as {
          isOTPVerified: boolean
          reason?: string
        }

        if (!data.isOTPVerified && data.reason) {
          return {
            success: false,
            message: data.reason,
          }
        }

        return {
          success: true,
          message: "Phone number verified",
        }
      })
      .catch(() => {
        return {
          success: false,
          message: "Something went wrong",
        }
      })

    return response
  },
}

export default otpless
