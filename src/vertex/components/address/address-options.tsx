"use client"

import { api } from "~/vertex/lib/trpc/trpc-context-provider"
import AppLoader from "../app/app-loader"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { addressChangeAction, addressDeleteAction } from "~/vertex/lib/server/server-actions"
import { useRouter } from "next/navigation"

interface AddressOptionsProps {
  open: boolean
  onOpenChange: (a: boolean) => void
  children: (props: ReturnType<typeof useAddressOptionsLogic>) => React.ReactNode
}

export default function AddressOptions({ ...props }: AddressOptionsProps) {
  const {} = props

  const value = useAddressOptionsLogic(props)

  return <>{!value.isLoading ? props.children(value) : <AppLoader className="h-[400px]" />}</>
}

function useAddressOptionsLogic(props: Omit<AddressOptionsProps, "children">) {
  const router = useRouter()

  const { data, isLoading: isGetting } = api.address.options.useQuery(undefined, {
    refetchOnMount: true,
  })

  const changeAction = useActionHandler(addressChangeAction, {
    onSuccess: () => {
      props.onOpenChange(false)
    },
  })

  const deleteAction = useActionHandler(addressDeleteAction, {
    onSuccess: () => {
      props.onOpenChange(false)
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
