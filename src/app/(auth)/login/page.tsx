import React from "react"
import { AuthProvider } from "~/vertex/components/auth/auth-provider"
import AuthContainer from "./_components/auth-container"

export default function Page(props: PageProps) {
  return (
    <AuthProvider loader={<div></div>} error={<div></div>}>
      <AuthContainer />
    </AuthProvider>
  )
}

type PageProps = {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}
