"use client"

import { Pencil, Trash } from "lucide-react"
import { useState } from "react"
import { Button } from "~/app/_components/ui/button"
import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
import { cn } from "~/lib/utils/functions/ui"
import AddressOptions from "~/vertex/components/address/address-options-builder"
import { CourierServiceabilityForm } from "~/vertex/components/courier/courier-serviceability-form"

interface AddressModelProps extends React.HTMLAttributes<HTMLElement> {}

export default function AddressModel({ ...props }: AddressModelProps) {
  const {} = props
  const [open, openSet] = useState(false)

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => openSet(true)}>
        Change
      </Button>

      <ModelXDrawer open={open} onOpenChange={openSet} title="Select Delivery Address" className="p-0">
        <AddressOptions onSuccess={() => openSet(false)}>
          {(props) => (
            <div className="w-full bg-slate-50">
              {props.options.length >= 1 ? (
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
              ) : (
                <div className="bg-white p-4">
                  <CourierServiceabilityForm onSuccess={() => openSet(false)}>
                    {(props) => (
                      <div>
                        <FormField
                          control={props.form.control}
                          name="postcode"
                          render={({ field }) => (
                            <div>
                              <div className="relative">
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder=" " {...{ ...field, ...props.postcodeFieldController }} />
                                  </FormControl>

                                  <FormLabel>Post code</FormLabel>
                                </FormItem>

                                <Button
                                  type="submit"
                                  isLoading={props.isLoading}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-0 px-0 text-sm font-medium uppercase text-foreground"
                                >
                                  Check
                                </Button>
                              </div>

                              <FormMessage />
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </CourierServiceabilityForm>
                </div>
              )}

              <div className="py-2 text-center">OR</div>

              <div className="bg-white p-4">
                <Button size="sm" className="w-full" onClick={() => props.addNew()}>
                  Add New Address
                </Button>
              </div>
            </div>
          )}
        </AddressOptions>
      </ModelXDrawer>
    </>
  )
}
