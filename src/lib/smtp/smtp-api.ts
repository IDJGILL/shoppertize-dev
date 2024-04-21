import nodemailer from "nodemailer"
import type Mail from "nodemailer/lib/mailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"
import { env } from "~/env.mjs"

export type SMTPProps = {
  to: string
  subject: string
  html: string
}

export const smtp = async (props: SMTPProps) => {
  const config = {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    requireTLS: true,
    connectionTimeout: 10000,
    auth: {
      user: env.SMTP_USER_EMAIL,
      pass: env.SMTP_USER_PASS,
    },
  } satisfies SMTPTransport.Options

  const transporter = nodemailer.createTransport(config)

  const message = {
    from: env.SMTP_USER_EMAIL,
    to: props.to,
    subject: props.subject,
    html: props.html,
  } satisfies Mail.Options

  await transporter.sendMail(message)
}
