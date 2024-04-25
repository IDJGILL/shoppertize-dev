import "~/app/styles/globals.css"
import "react-loading-skeleton/dist/skeleton.css"
import { Toaster } from "sonner"
import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import AppContext from "~/vertex/components/app/app-context"

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`font-sans text-foreground antialiased ${inter.variable}`}>
      <body>
        <AppContext>{children}</AppContext>

        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
