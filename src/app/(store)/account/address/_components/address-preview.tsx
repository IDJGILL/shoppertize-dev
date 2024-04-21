"use client"

import Link from "next/link"
import Box from "~/app/_components/box"
import LoaderFallBack from "~/app/_components/loader-fallback"
import { Button } from "~/app/_components/ui/button"
import { api } from "~/lib/server/access/client"

interface AddressPreviewProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressPreview({ ...props }: AddressPreviewProps) {
  const {} = props

  const { data, isLoading, isFetching } = api.store.address.getAddress.useQuery(
    undefined,
    {
      refetchOnMount: true,
    },
  )

  if (isLoading || isFetching) return <LoaderFallBack />

  if (!data?.shipping.address1)
    return (
      <Box className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="w-full text-left">
            <p>Add Address</p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          Add
        </Button>
      </Box>
    )

  return (
    <Box className="flex items-center justify-between">
      <div className="flex gap-4">
        <div className="w-[95%] text-left">
          <div className="mb-1 text-base font-semibold">
            {data?.shipping.firstName} {data?.shipping.lastName}
          </div>

          <div className="line-clamp-1 text-sm text-muted-foreground">
            {data?.shipping.address1}, {data?.shipping.address2}
          </div>
          <div className="mb-2 text-sm text-muted-foreground">
            {data?.shipping.phone}
          </div>
        </div>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link href={`/account/address/update`}>Edit</Link>
      </Button>
    </Box>
  )
}
