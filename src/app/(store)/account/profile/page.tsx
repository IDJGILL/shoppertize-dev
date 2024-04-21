import { ErrorBoundary } from "react-error-boundary"
import ProfileHandler from "~/lib/ui/account/profile/profile-handler"

export default function Profile() {
  return (
    <ErrorBoundary fallback={<div></div>}>
      <ProfileHandler />
    </ErrorBoundary>
  )
}
