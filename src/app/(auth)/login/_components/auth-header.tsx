"use client"

import ShoppertizeIcon from "~/assets/brand/shoppertize-icon.svg"
import Image from "next/image"
import Link from "next/link"
import { useAuthContext } from "~/vertex/components/auth/auth-context"

interface AuthHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthHeader({ ...props }: AuthHeaderProps) {
  const {} = props
  const { action, identifyForm } = useAuthContext()

  const headerText = () => {
    switch (action) {
      case "signup": {
        return {
          title: "Email Verified",
          description: "Let us know more about you!",
        }
      }

      case "login": {
        return {
          title: "Welcome Back",
          description: "We're happy to see you back!",
        }
      }

      case "otp": {
        return {
          title: "Verify it's you",
          description: `4 digit OTP sent to ${identifyForm.getValues("username")}`,
        }
      }

      case "status-polling": {
        return {
          title: "Verify it's you",
          description: `OTP link sent to ${identifyForm.getValues("username")}`,
        }
      }

      case "reset": {
        return {
          title: "Reset Password",
          description: "Create a strong and secure password",
        }
      }

      default:
        return {
          title: "Sign in",
          description: "Let's get you signed in real quick!",
        }
    }
  }

  const header = headerText()

  return (
    <header className="mb-10 w-full">
      <div className="relative mx-auto mb-4 flex aspect-square h-12 w-12 max-w-max items-center justify-center rounded-lg border bg-white">
        <Link href="/">
          <Image src={ShoppertizeIcon as string} alt="" width={24} height={24} className="ml-1" priority />
        </Link>
      </div>

      <h2 className="text-2xl font-semibold tracking-tighter">{header.title}</h2>

      <p className="mt-2">{header.description}</p>
    </header>
  )
}
