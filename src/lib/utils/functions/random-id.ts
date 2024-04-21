import { nanoid } from "nanoid"

export const randomId = (length = 10) => {
  return nanoid(length)
}
