import { Eye, EyeOff } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { type UseFormReturn, type ControllerRenderProps, type FieldValues, type Path } from "react-hook-form"

import { cn } from "~/lib/utils/functions/ui"
import { FormLabel } from "./form"
import { countryCodes } from "~/lib/utils/constants/country-codes"
import { ScrollArea } from "./scroll-area"
import { TriangleDownIcon } from "@radix-ui/react-icons"
import { Progress } from "./progress"
import { type AddressSchemaProps } from "~/lib/modules/address/utils/address-schemas"
import { Address } from "~/vertex/modules/address/address-models"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "peer flex h-12 w-full overflow-hidden rounded border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-0",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

interface PasswordProps<T> {
  toggle: boolean
  form: UseFormReturn<FieldValues & T, unknown, undefined>
  field: ControllerRenderProps
  placeholder: string
  showPasswordStrength: boolean
}

function Password<T>({ ...props }: PasswordProps<T>) {
  const [view, setView] = useState(false)

  const value = (props.field.value as string) ?? ""

  useEffect(() => {
    if (!props.toggle) return

    setView(false)

    return () => setView(false)
  }, [value, props.form.formState.isSubmitting, props.toggle])

  const passwordScore = value.length > 0 ? (value.length + 2) * 10 : value.length

  return (
    <>
      <div
        className={cn("relative", {
          "mb-2": props.showPasswordStrength,
        })}
      >
        <Input placeholder=" " type={view ? "text" : "password"} {...props.field} />

        <FormLabel onClick={() => props.form.setFocus(props.field.name as Path<FieldValues & T>)}>
          {props.placeholder}
        </FormLabel>

        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setView(!view)}>
          {props.toggle && (view ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />)}
        </button>
      </div>

      {props.showPasswordStrength && (
        <>
          <Progress value={passwordScore} />

          <span>
            {passwordScore < 100 ? (
              <div className="mt-2 text-xs font-medium">Must contain at least 8 characters</div>
            ) : (
              <div className="mt-2 text-xs font-medium">Great! Your password is strong</div>
            )}
          </span>
        </>
      )}
    </>
  )
}

interface PhoneInputProps {
  form: UseFormReturn<Address, unknown, undefined>
  field: ControllerRenderProps
  name: "shipping_phone" | "billing_phone"
}

function PhoneInput({ ...props }: PhoneInputProps) {
  const [selectedCountryCode, setCountryCode] = useState("+91")
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  async function handleInputValueChange(value: string) {
    if (isOpen) {
      setIsOpen(false)
    }

    const phoneNumber = selectedCountryCode.replace("+", "") + value

    props.form.setValue(props.name, phoneNumber)

    await props.form.trigger(props.name)
  }

  const fieldValue = (props.field.value as string) ?? ""

  useEffect(() => {
    setInputValue(fieldValue.replace(selectedCountryCode.replace("+", ""), ""))
  }, [fieldValue, selectedCountryCode])

  return (
    <div className="relative w-full">
      <div className="w-full overflow-hidden rounded-md border shadow-sm">
        <div className={cn("flex w-full items-center duration-200 ease-in-out will-change-transform")}>
          <div
            className={cn(
              "flex h-full w-16 cursor-pointer select-none items-center justify-center border-r text-sm font-medium duration-200 ease-in-out",
            )}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selectedCountryCode} <TriangleDownIcon className="text-muted-foreground" />
          </div>

          <input
            className={cn(
              "peer flex h-12 w-full flex-1 overflow-hidden rounded-md bg-transparent px-3 py-1 text-sm font-medium transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder="Enter your Phone Number"
            {...props.field}
            value={inputValue}
            onChange={(e) => handleInputValueChange(e.target.value)}
          />
        </div>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+10px)] z-[1000] max-h-[200px] w-full overflow-hidden rounded-md border bg-white shadow-md">
            <ScrollArea className="h-[200px]">
              <ul className="w-full py-2 text-sm">
                {countryCodes.map((countryCode) => (
                  <li
                    key={countryCode.name}
                    value={countryCode.code}
                    onClick={() => {
                      setCountryCode(countryCode.code)
                      setIsOpen(false)
                    }}
                    className={cn("cursor-pointer px-4 py-1 font-medium hover:bg-zinc-100", {
                      "bg-primary text-primary text-white hover:bg-primary": countryCode.code === selectedCountryCode,
                    })}
                  >
                    {countryCode.code} - {countryCode.name}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}

export { Input, Password, PhoneInput }

// const PasswordRules = {
//   uppercase: z.string().refine((data) => /[A-Z]/.test(data), {
//     message: "Must contain at least one uppercase letter",
//   }),
//   lowercase: z.string().refine((data) => /[a-z]/.test(data), {
//     message: "Must contain at least one lowercase letter",
//   }),
//   digit: z.string().refine((data) => /\d/.test(data), {
//     message: "Must contain at least one number",
//   }),
//   length: z.string().refine((data) => data.length >= 8, {
//     message: "Must be at least 8 characters long",
//   }),
// }

// function getPasswordProgress(password: string) {
//   let progress = 0

//   // Validate Uppercase
//   const hasUppercase = PasswordRules.uppercase.safeParse(password)

//   if (hasUppercase.success) {
//     progress += 25
//   }

//   // Validate Lowercase
//   const hasLowercase = PasswordRules.lowercase.safeParse(password)

//   if (hasLowercase.success) {
//     progress += 25
//   }

//   // Validate Digit
//   const hasDigit = PasswordRules.digit.safeParse(password)

//   if (hasDigit.success) {
//     progress += 25
//   }

//   // Validate Length
//   const hasLength = PasswordRules.length.safeParse(password)

//   if (hasLength.success) {
//     progress += 25
//   }

//   return progress
// }
