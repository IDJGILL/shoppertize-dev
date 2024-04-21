import { z } from "zod"
import { identifyUsernameType } from "./auth-client-utils"

export const $Identify = z
  .object({
    username: z.string(),
    countryCode: z.string(),
  })
  .superRefine((inputs, ctx) => {
    const usernameType = identifyUsernameType(inputs.username)

    switch (usernameType) {
      case "email": {
        const result = z
          .object({ email: z.string().email() })
          .safeParse({ email: inputs.username })

        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["username"],
            message: result.error.message,
          })

          return false
        }

        return true
      }

      case "phone": {
        const result = z
          .object({
            phone: z
              .string()
              .min(10, "Please enter valid phone number")
              .max(15, "Please enter valid phone number"),
          })
          .safeParse({ phone: inputs.username })

        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["username"],
            message: result.error.message,
          })

          break
        }

        return true
      }

      default: {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["username"],
          message: "Invalid input",
        })
      }
    }

    return true
  })

export type Identify = z.infer<typeof $Identify>

export const $Login = z.object({
  id: z.string().optional(),
  username: z.string().min(1),
  password: z.string().min(1, "Incorrect password entered."),
})

export type Login = z.infer<typeof $Login>

export const $Signup = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  password: z
    .string()
    .min(9)
    .max(20)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
      message:
        "Password must be at least 9 characters long and contain letters and digits.",
    }),
})

export type Signup = z.infer<typeof $Signup>

export const $UpdatePassword = z.object({
  id: z.string().min(1),
  password: z
    .string()
    .min(9)
    .max(20)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
      message:
        "Password must be at least 9 characters long and contain letters and digits.",
    }),
})

export type UpdatePassword = z.infer<typeof $UpdatePassword>

export const $Profile = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.enum(["male", "female", "other", "select"]),
  dateOfBirth: z.string(),
  country: z.string(),
})

export type Profile = z.infer<typeof $Profile>

export const $Verify = z.object({
  id: z.string(),
  value: z.string(),
})

export type Verify = z.infer<typeof $Verify>

export const $AuthSessionId = z.object({
  id: z.string(),
})

export type AuthSessionId = z.infer<typeof $AuthSessionId>

export const $ForgetPassword = z.object({
  email: z.string().email(),
})

export type ForgetPassword = z.infer<typeof $ForgetPassword>
