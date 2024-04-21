import { type NextRequest } from "next/server"
import { type SMTPProps, smtp } from "~/lib/smtp/smtp-api"
import { createAuthedApi } from "~/lib/utils/functions/create-api"

export const POST = async (req: NextRequest) =>
  createAuthedApi<SMTPProps, void>(req, smtp)
