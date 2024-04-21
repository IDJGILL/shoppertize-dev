import { type ProfileDTOType } from "~/lib/server/api/auth/auth.dtos"
import ProfileForm from "./profile-form"
import AccountSectionWrapper from "../../_components/account-section-wrapper"

interface ProfileLayoutProps extends React.HTMLAttributes<HTMLElement> {
  profile: ProfileDTOType | null
}

export default function ProfileLayout({ ...props }: ProfileLayoutProps) {
  const {} = props

  return (
    <AccountSectionWrapper
      title="Profile"
      sub="View, edit and manage"
      className="max-w-2xl"
    >
      <ProfileForm profile={props.profile} />
    </AccountSectionWrapper>
  )
}
