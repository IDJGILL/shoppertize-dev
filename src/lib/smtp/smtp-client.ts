import { authedApiClient } from "../utils/functions/create-api"
import { type SMTPProps } from "./smtp-api"

export const emailClient = async (props: SMTPProps) => {
  try {
    await authedApiClient<SMTPProps, void>("/admin/services/email", props)

    return true
  } catch {
    return false
  }
}
