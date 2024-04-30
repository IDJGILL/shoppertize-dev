"use client"

import { useState } from "react"
import { useUpdateEffect } from "react-use"
import { Input } from "./ui/input"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "~/lib/utils/functions/ui"
import { ChevronDown, Search } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { callingCodes } from "~/vertex/global/data/data-calling-codes"

/**
 * PhoneInput component for entering phone numbers with country code.
 * @param value The value must be passed in splittable format example: 91::7510002585
 * @param onInputChange - Callback function triggered when the input value changes and passes string as splittable CallingCode::PhoneNumber.
 * 
 * @example usage with react hook form
 * <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
            <div>
                <FormItem>
                    <PhoneInput value={field.value} onInputChange={(value) => form.setValue("phone", value)} />
                </FormItem>

                <FormMessage />
            </div>
        )}
    />
 */
const PhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }) => {
    const [callingCode, phoneNumber] = ((props.value as string) ?? "").split("::")
    console.log({ callingCode })
    const [code, codeSet] = useState(callingCode!.length > 1 ? "+" + callingCode : "+1")
    const [search, searchSet] = useState("")
    const [dropdown, dropdownSet] = useState(false)
    const [input, inputSet] = useState<React.ChangeEvent<HTMLInputElement>>()

    useUpdateEffect(() => {
      if (!props.onChange || !input) return

      const event = {
        ...input,
        target: { ...input.target, value: code.slice(1) + "::" + (input.target.value ?? phoneNumber) },
      } satisfies React.ChangeEvent<HTMLInputElement>

      props.onChange(event)
    }, [input, code])

    return (
      <div className="relative w-full">
        <Popover open={dropdown} onOpenChange={dropdownSet}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "absolute left-[1px] top-1/2 z-10 flex h-[calc(100%-1px)] w-16 -translate-y-1/2 items-center justify-center rounded-l text-sm duration-300 ease-in-out",
              )}
              onClick={() => dropdownSet((prev) => !prev)}
            >
              {code}
              <ChevronDown
                className={cn("ml-1 h-3 w-3 duration-300 ease-in-out", {
                  "rotate-180": dropdown,
                })}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent className="z-10 w-full p-0" align="start">
            <div className="mx-2 flex items-center border-b">
              <Search className="h-4 w-4" />{" "}
              <input
                value={search}
                placeholder="Search for countries"
                className="h-10 flex-1 px-4 text-sm outline-none"
                onChange={(e) => searchSet(e.currentTarget.value)}
              />
            </div>

            <ScrollArea className="h-[180px] p-2">
              <ul className="w-full text-sm">
                {callingCodes
                  .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search))
                  .map((country) => (
                    <li
                      key={country.name}
                      value={country.code}
                      onClick={() => {
                        codeSet(country.code)

                        dropdownSet(false)
                      }}
                      className={cn(
                        "flex h-10 cursor-pointer items-center rounded-sm px-4 font-medium hover:bg-zinc-100",
                        {
                          "bg-primary text-primary text-white hover:bg-primary": country.code === code,
                        },
                      )}
                    >
                      {country.name} ({country.code})
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Input
          {...props}
          type="text"
          value={input?.target.value ?? phoneNumber}
          onChange={inputSet}
          className={cn(className, "pl-16")}
          inputMode="numeric"
        />
      </div>
    )
  },
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
