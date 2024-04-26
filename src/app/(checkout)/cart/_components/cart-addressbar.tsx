"use client"

import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Box from "~/app/_components/box"
import { Button } from "~/app/_components/ui/button"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
import { cn } from "~/lib/utils/functions/ui"
import AddressOptions from "~/vertex/components/address/address-options"
import { useCartContext } from "~/vertex/components/cart/cart-context"

interface AddressBarProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressBar({ ...props }: AddressBarProps) {
  const {} = props
  const [open, openSet] = useState(false)

  const { address } = useCartContext()

  const hasAddress = !!address?.address

  return (
    <Box>
      {!hasAddress && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-sm font-semibold">Please add a Delivery Address</div>
          </div>

          <Button size="sm" variant="outline" onClick={() => openSet(true)}>
            Change
          </Button>
        </div>
      )}

      {hasAddress && (
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-sm font-semibold">
              <span className="font-normal text-muted-foreground opacity-80">Delivering order to:</span>{" "}
              {address.fullName}
            </div>

            <div className="line-clamp-1 text-sm">{address?.address}</div>
          </div>

          <Button size="sm" variant="outline" onClick={() => openSet(true)}>
            Change
          </Button>
        </div>
      )}

      <ModelXDrawer open={open} onOpenChange={openSet} title="Select Delivery Address" className="p-0">
        <AddressOptions open={open} onOpenChange={openSet}>
          {(props) => (
            <div className="w-full bg-slate-50">
              <ScrollArea className="h-[400px]">
                {props.options.map((a) => (
                  <div
                    key={a.address}
                    className={cn("relative mb-2 bg-white p-4 text-sm", {
                      "border border-primary": a.isSelected,
                    })}
                  >
                    <div onClick={() => props.mutateChange(a.id)} className="cursor-pointer">
                      <h3 className="mb-1 font-semibold">
                        {a.fullName}{" "}
                        <span className=" text-xs font-normal text-muted-foreground">
                          {a.isDefault ? "(Default)" : ""}
                        </span>
                      </h3>

                      <div className="mb-3 text-xs">
                        <p>{a.address}</p>
                        <p>{a.city}</p>
                        <p>
                          {a.state} - {a.postcode}
                        </p>
                      </div>

                      <p className="mb-3 text-xs">
                        <span className="font-semibold">Mobile:</span> {a.phone}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" className="h-8 px-4 text-xs" onClick={() => props.edit(a.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button variant="outline" className="h-8 px-4 text-xs" onClick={() => props.mutateDelete(a.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>

              <div className="bg-white p-4">
                <Button size="sm" className="w-full" onClick={() => props.addNew()}>
                  Add New Address
                </Button>
              </div>
            </div>
          )}
        </AddressOptions>
      </ModelXDrawer>
    </Box>
  )
}
