import { ExtendedError } from "./extended-error"

export function phoneInputValues(value: string) {
  const [callingCode, phone] = value.split("::")

  if (!callingCode || !phone)
    throw new ExtendedError({ code: "INTERNAL_SERVER_ERROR", message: "Invalid phone number format" })

  const phoneNumber = callingCode + phone

  return { callingCode, phone, phoneNumber }
}
