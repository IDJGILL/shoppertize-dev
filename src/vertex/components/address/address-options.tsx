"use client"

import { api } from "~/vertex/lib/trpc/trpc-context-provider"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { addressChangeAction, addressDeleteAction } from "~/vertex/lib/server/server-actions"
import { useRouter } from "next/navigation"

interface AddressOptionsProps {
  onSuccess: () => void
  children: (props: ReturnType<typeof useAddressOptions>) => React.ReactNode
}

export default function AddressOptions({ ...props }: AddressOptionsProps) {
  const {} = props

  const value = useAddressOptions(props)

  return <>{props.children(value)}</>
}

function useAddressOptions(props: Omit<AddressOptionsProps, "children">) {
  const router = useRouter()

  const { data, isLoading: isGetting } = api.address.options.useQuery(undefined, {
    refetchOnMount: true,
  })

  const changeAction = useActionHandler(addressChangeAction, {
    onSuccess: () => {
      props.onSuccess()
    },
  })

  const deleteAction = useActionHandler(addressDeleteAction, {
    onSuccess: () => {
      props.onSuccess()
    },
  })

  const mutateChange = (id: string) => changeAction.mutate(id)

  const mutateDelete = (id: string) => deleteAction.mutate(id)

  const edit = (id: string) => router.push(`/checkout/address?aid=${id}`)

  const addNew = () => router.push("/checkout/address?")

  const isLoading = isGetting || changeAction.isLoading

  const options = data ?? []

  return {
    edit,
    addNew,
    options,
    isLoading,
    mutateChange,
    mutateDelete,
  }
}
