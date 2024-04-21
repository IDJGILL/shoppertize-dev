"use client"

import dynamic from "next/dynamic"
import { useAuthContext } from "~/vertex/components/auth/auth-context"

const AuthIdentifyForm = dynamic(() => import("./auth-identify-form"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthLoginFrom = dynamic(() => import("./auth-login-form"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthUpdatePasswordForm = dynamic(() => import("./auth-update-password-form"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthSignUpForm = dynamic(() => import("./auth-signup-form"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthPollingScreen = dynamic(() => import("./auth-polling-screen"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthOtpForm = dynamic(() => import("./auth-otp-form"), {
  ssr: false,
  loading: () => <Loader />,
})

const AuthVerifyScreen = dynamic(() => import("./auth-verify-screen"), {
  ssr: false,
  loading: () => <Loader />,
})

export default function AuthContainer() {
  const { action, isMounted } = useAuthContext()

  if (!isMounted) return <Loader />

  switch (action) {
    case "verify": {
      return <AuthVerifyScreen />
    }

    case "otp": {
      return <AuthOtpForm />
    }

    case "status-polling": {
      return <AuthPollingScreen />
    }

    case "signup": {
      return <AuthSignUpForm />
    }

    case "reset": {
      return <AuthUpdatePasswordForm />
    }

    case "login": {
      return <AuthLoginFrom />
    }

    default: {
      return <AuthIdentifyForm />
    }
  }
}

interface LoaderProps extends React.HTMLAttributes<HTMLElement> {}

function Loader({ ...props }: LoaderProps) {
  const {} = props

  return (
    <div className="flex h-[420px] w-full items-center justify-center">
      <div className="loader-spinner"></div>
    </div>
  )
}
