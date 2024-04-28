import { capitalize, upperCase } from "lodash-es"

export const textTransform = {
  capitalize: capitalizeWords,
  uppercase: upperCase,
  sentenceCase: capitalize,
}

function capitalizeWords(str?: string): string {
  const words = (str?.toLowerCase() ?? "").split(" ")

  return words.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(" ")
}
