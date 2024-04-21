import "~/app/styles/globals.css"
import "react-loading-skeleton/dist/skeleton.css"
import { Toaster } from "sonner"
import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { AuthSessionProvider } from "~/vertex/components/auth/auth-session-context"
import { TRPCContextProvider } from "~/vertex/lib/trpc/trpc-context-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-custom",
})

export const metadata: Metadata = {
  title: {
    default: "Shoppertize - Shop kar befikar",
    template: "%s - Shoppertize",
  },
  description: "Shop kar befikar",
  twitter: {
    card: "summary_large_image",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`font-sans text-foreground antialiased ${inter.variable}`}
    >
      <body>
        <TRPCContextProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </TRPCContextProvider>

        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
