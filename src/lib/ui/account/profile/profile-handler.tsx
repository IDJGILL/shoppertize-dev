"use client"

import ProfileLayout from "~/app/(store)/account/profile/_components/profile-layout"
import LoaderFallBack from "~/app/_components/loader-fallback"
import { api } from "~/lib/server/access/client"

// interface ProfileHandlerProps extends React.HTMLAttributes<HTMLElement> {}

export default function ProfileHandler() {
  const { data, error, isLoading, isFetching } = api.auth.getProfile.useQuery()

  if (error) throw new Error("Something went wrong")

  if (isLoading || isFetching) return <LoaderFallBack />

  return <ProfileLayout profile={data} />
}
