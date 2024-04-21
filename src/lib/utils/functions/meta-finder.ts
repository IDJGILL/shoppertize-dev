import { isJSON } from "./is-json"

const metaFinder = {
  parse: <TOutput>(options: {
    metaData: MetaData[]
    key: string
    errorMessage?: string
  }) => {
    const value =
      options.metaData?.find((meta) => meta.key === options.key)?.value ?? null

    if (value === null) {
      throw new Error(
        options.errorMessage ??
          `Meta data with key "${options.key}" has no value.`,
      )
    }

    if (isJSON(value)) {
      const jsonData = JSON.parse(value) as TOutput | null

      if (jsonData === null) {
        throw new Error(
          options.errorMessage ??
            `Meta data with key "${options.key}" has no value.`,
        )
      }

      return jsonData
    }

    return value as TOutput
  },

  safeParse: <TOutput>(options: { metaData: MetaData[]; key: string }) => {
    const value =
      options.metaData?.find((meta) => meta.key === options.key)?.value ?? null

    if (value && isJSON(value)) {
      const jsonData = JSON.parse(value) as TOutput | null

      return jsonData
    }

    return value as TOutput
  },

  create: {
    single: <T>(metaData: { key: string; value: T }): MetaData => {
      return {
        key: metaData.key,
        value: JSON.stringify(metaData.value),
      }
    },
    multiple: <T>(metaData: Record<string, T>): MetaData[] => {
      const entries = Object.entries(metaData)

      return entries.map(([key, value]) => ({
        key: key,
        value: JSON.stringify(value),
      }))
    },
  },
}

export default metaFinder
