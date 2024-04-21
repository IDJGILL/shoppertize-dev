import * as jose from "jose"
import metaFinder from "./meta-finder"
import { env } from "~/env.mjs"
import { type Profile } from "~/lib/modules/auth/auth-schema"

export const meta = {
  token: {
    verification: {
      parse: async (
        metaData: MetaData[],
        email: string,
        matcherToken: string,
      ): Promise<void> => {
        const token = metaFinder.parse<string>({
          metaData: metaData,
          key: "verification",
          errorMessage: "Verification token not found.",
        })

        if (token !== matcherToken) {
          throw new Error("Verification token don't match.")
        }

        const secret = env.AUTH_SECRET + email

        await jose
          .jwtVerify(token, new TextEncoder().encode(secret))
          .catch(() => {
            throw new Error("Invalid Verification token")
          })
      },
      add: (token: string | null): MetaData => {
        return metaFinder.create.single({
          key: "verification",
          value: token,
        })
      },
    },
    session: {
      parse: (metaData: MetaData[]): string => {
        const token = metaFinder.parse<string>({
          metaData: metaData,
          key: "session",
          errorMessage: "Session token not found",
        })

        return token
      },
      safeParse: (metaData: MetaData[]): string | null => {
        const token = metaFinder.safeParse<string>({
          metaData: metaData,
          key: "session",
        })

        if (!token) return null

        return token
      },
      add: (token: string | null): MetaData => {
        return metaFinder.create.single({
          key: "session",
          value: token,
        })
      },
    },
    order: {
      parse: async (token: string): Promise<string> => {
        const secret = env.AUTH_SECRET

        await jose
          .jwtVerify(token, new TextEncoder().encode(secret))
          .catch(() => {
            throw new Error("Invalid Verification token")
          })

        return token
      },
      safeParse: (metaData: MetaData[]): string | null => {
        const token = metaFinder.safeParse<string>({
          metaData: metaData,
          key: "order",
        })

        if (!token) return null

        return token
      },
      add: (token: string | null): MetaData => {
        return metaFinder.create.single({
          key: "order",
          value: token,
        })
      },
    },
  },
  usedCoupons: {
    parse: (metaData: MetaData[], message?: string): UsedCoupon[] => {
      const usedCoupons = metaFinder.parse<UsedCoupon[]>({
        metaData: metaData,
        key: "used_coupons",
        errorMessage: message,
      })

      if (usedCoupons.length === 0) {
        throw new Error(message ?? "No used coupons found.")
      }

      return usedCoupons
    },
    safeParse: (metaData: MetaData[]): UsedCoupon[] | null => {
      const usedCoupons = metaFinder.safeParse<UsedCoupon[]>({
        metaData: metaData,
        key: "used_coupons",
      })

      if (!usedCoupons || usedCoupons.length === 0) return null

      return usedCoupons
    },
    add: (data: { old: UsedCoupon[]; new: UsedCoupon }): MetaData => {
      return metaFinder.create.single({
        key: "used_coupons",
        value: [...data.old, data.new],
      })
    },
  },
  profile: {
    parse: (metaData: MetaData[], message?: string): Profile => {
      const profile = metaFinder.parse<Profile>({
        metaData: metaData,
        key: "profile",
        errorMessage: message ?? "Profile not found.",
      })

      return profile
    },
    safeParse: (metaData: MetaData[]): Profile | null => {
      const profile = metaFinder.safeParse<Profile>({
        metaData: metaData,
        key: "profile",
      })

      return profile
    },
    add: (profile: Profile): MetaData => {
      return metaFinder.create.single({
        key: "profile",
        value: profile,
      })
    },
  },
  userMetaData: {
    isEmailVerified: {
      parse: (metaData: MetaData[], message?: string): boolean => {
        const isVerified = metaFinder.parse<true | null>({
          metaData: metaData,
          key: "email_verification",
          errorMessage: message ?? "Email verification not found.",
        })

        if (!isVerified) throw new Error(message ?? "Email not verified.")

        return !!isVerified
      },
      safeParse: (metaData: MetaData[]): boolean => {
        const isVerified = metaFinder.safeParse<true | null>({
          metaData: metaData,
          key: "email_verification",
        })

        if (!isVerified) return false

        return !!isVerified
      },
    },
    isPhoneVerified: {
      parse: (metaData: MetaData[], message?: string): boolean => {
        const isVerified = metaFinder.parse<true | null>({
          metaData: metaData,
          key: "phone_verification",
          errorMessage: message ?? "Phone verification not found.",
        })

        if (!isVerified) throw new Error(message ?? "Phone not verified.")

        return !!isVerified
      },
      safeParse: (metaData: MetaData[]): boolean => {
        const isVerified = metaFinder.safeParse<true | null>({
          metaData: metaData,
          key: "phone_verification",
        })

        if (!isVerified) return false

        return !!isVerified
      },
    },
  },
}
