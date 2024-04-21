import * as jose from "jose"

const jwt = {
  sign: async <TPayload extends Record<string, unknown>>(options: {
    payload: TPayload
    secret: string
    secretSuffix?: string
    expiresIn: string
  }) => {
    const token = await new jose.SignJWT(options.payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(
        new TextEncoder().encode(options.secret + (options.secretSuffix ?? "")),
      )

    return token
  },
  verify: {
    parse: async <TPayload extends Record<string, unknown>>(options: {
      token: string | string[] | null
      secret: string
      secretSuffix?: string
    }) => {
      if (!options.token || typeof options.token !== "string") throw new Error()

      const payload = jwt.decode.parse<TPayload>(options.token)

      await jose
        .jwtVerify(
          options.token,
          new TextEncoder().encode(
            options.secret + (options.secretSuffix ?? ""),
          ),
        )
        .catch(() => {
          throw new Error("Invalid Verification token")
        })

      return payload
    },
    safeParse: async <TPayload extends Record<string, unknown>>(options: {
      token: string | string[] | null
      secret: string
      secretSuffix?: string
    }) => {
      try {
        return await jwt.verify.parse<TPayload>(options)
      } catch {
        return null
      }
    },
  },
  decode: {
    parse: <TPayload extends Record<string, unknown>>(token: string) => {
      const parts = token.split(".")

      if (parts.length !== 3) {
        throw new Error("Not a valid JWT token")
      }

      const payloadEnc = parts[1]

      if (!payloadEnc) throw new Error("Invalid token")

      const payloadStr = Buffer.from(payloadEnc, "base64").toString("utf8")

      const payload = JSON.parse(payloadStr) as IJwtPayload & TPayload

      if (!payload.exp || !payload.iat) {
        throw new Error("Invalid JWT payload structure")
      }

      return payload
    },
    safeParse: <TPayload extends Record<string, unknown>>(token: string) => {
      try {
        return jwt.decode.parse<TPayload>(token)
      } catch {
        return null
      }
    },
  },
}

type IJwtPayload = {
  id: string
  exp: number
  iat: number
}

export default jwt
