import { isJSON } from "./is-json"

export const base64 = {
  parse: <TOutput>(options: { base64Id: string; index: number }): TOutput => {
    const decoded = Buffer.from(options.base64Id, "base64").toString("utf8")

    if (isJSON(decoded)) {
      return JSON.parse(decoded) as TOutput
    }

    const value = decoded.split(":")[options.index]

    if (!value) throw new Error()

    return value as TOutput
  },
  safeParse: <TOutput>(options: {
    base64Id: string
    index: number
  }): TOutput | null => {
    const decoded = Buffer.from(options.base64Id, "base64").toString("utf8")

    if (isJSON(decoded)) {
      return JSON.parse(decoded) as TOutput
    }

    const value = decoded.split(":")[options.index]

    if (!value) return null

    return value as TOutput
  },
  create: (values: (string | number)[]): string => {
    const encoded = Buffer.from(values.join(":")).toString("base64")

    return encoded
  },
}
