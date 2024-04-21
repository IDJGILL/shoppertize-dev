import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { api } from "../../server/access/client"
import {
  ProfileDTO,
  type ProfileDTOType,
} from "../../server/api/auth/auth.dtos"

export type ProfileProps = {
  profile: ProfileDTOType | null
}

export default function useProfile(props: ProfileProps) {
  const context = api.useContext()

  const { mutate, isLoading } = api.auth.updateProfile.useMutation({
    onSuccess: async () => {
      await context.auth.getProfile.invalidate()
      toast.success("Profile updated successfully.")
    },
    onError: () => {
      toast.error("Something went wrong, please try again.")
    },
  })

  const form = useForm<ProfileDTOType>({
    resolver: zodResolver(ProfileDTO),
    defaultValues: props.profile ?? undefined,
  })

  const handleSubmit = form.handleSubmit((data) => mutate(data))

  return {
    form,
    isLoading,
    handleSubmit,
  }
}

export type UseProfileOutputType = ReturnType<typeof useProfile>
