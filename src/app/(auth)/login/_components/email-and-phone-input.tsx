"use client"

import { useEffect, useState } from "react"
import { type UseFormReturn, type ControllerRenderProps } from "react-hook-form"
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
import { countryCodes } from "~/lib/utils/constants/country-codes"
import { cn } from "~/lib/utils/functions/ui"
import { ChevronDown, Search } from "lucide-react"
import { useUpdateEffect } from "react-use"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover"

interface EmailAndPhoneInputProps extends React.HTMLAttributes<HTMLElement> {
  inputProps: ControllerRenderProps<
    {
      username: string
      countryCode: string
    },
    "username"
  >
  form: UseFormReturn<
    {
      username: string
      countryCode: string
    },
    unknown,
    undefined
  >
}

export default function EmailAndPhoneInput({
  ...props
}: EmailAndPhoneInputProps) {
  const { inputProps, form } = props
  const [code, codeSet] = useState<(typeof countryCodes)[number]["code"]>("+91")
  const [search, searchSet] = useState("")

  const [dropdown, dropdownSet] = useState(false)

  const inputValue = inputProps.value ?? ""

  const isPhoneNumber = !!(
    inputValue.match(/^\d+$/) && !inputValue.match(/^[a-zA-Z]+$/)
  )

  useUpdateEffect(() => {
    dropdownSet(false)
  }, [inputValue])

  useEffect(() => {
    form.setValue("countryCode", code.replace("+", ""))
  }, [code, form])

  return (
    <>
      <div className="relative w-full">
        <div className="w-full">
          <Popover open={dropdown} onOpenChange={dropdownSet}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "invisible absolute left-[1px] top-1/2 z-10 flex h-[calc(100%-1px)] w-16 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-l text-sm opacity-0 duration-300 ease-in-out",
                  {
                    "visible translate-x-0 opacity-100": isPhoneNumber,
                  },
                )}
                onClick={() => dropdownSet((prev) => !prev)}
              >
                {code}{" "}
                <ChevronDown
                  className={cn("ml-1 h-3 w-3 duration-300 ease-in-out", {
                    "rotate-180": dropdown,
                  })}
                />
              </button>
            </PopoverTrigger>

            <PopoverContent className="z-10 !w-full p-0" align="start">
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
                  {countryCodes
                    .filter(
                      (a) =>
                        a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.code.includes(search),
                    )
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
                            "bg-primary text-primary text-white hover:bg-primary":
                              country.code === code,
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

          <FormItem>
            <FormControl>
              <Input
                {...inputProps}
                value={inputValue}
                inputMode={isPhoneNumber ? "numeric" : "email"}
                placeholder=" "
                className={cn("duration-300 ease-in-out", {
                  "!pl-16": isPhoneNumber,
                })}
              />
            </FormControl>

            <FormLabel>
              {inputValue.length < 1
                ? "Email or phone number"
                : isPhoneNumber
                  ? "Phone number"
                  : "Email address"}
            </FormLabel>
          </FormItem>
        </div>
      </div>
      <FormMessage className="text-left" />
    </>
  )
}
