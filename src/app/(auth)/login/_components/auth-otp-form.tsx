"use client"

import { cn } from "~/lib/utils/functions/ui"
import { OTPInput, type SlotProps } from "input-otp"
import { Button } from "~/app/_components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import AuthResendButton from "./auth-resend-button"
import AuthShell from "./auth-shell"
import { AuthOneTimePassCode } from "~/vertex/components/auth"

interface AuthOtpFormProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthOtpForm({ ...props }: AuthOtpFormProps) {
  const {} = props

  return (
    <AuthOneTimePassCode>
      {({ form, mutate, isLoading }) => (
        <AuthShell>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={mutate} className="mb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} type="hidden" className="hidden" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <div className="flex-1">
                      <FormItem>
                        <FormControl>
                          <OTPInput
                            {...field}
                            maxLength={4}
                            // onComplete={() => otpAutoSubmitHandler()}
                            containerClassName="group mx-auto w-max flex items-center has-[:disabled]:opacity-30 mt-4"
                            render={({ slots }) => (
                              <>
                                <div className="flex">
                                  {slots.slice(0, 2).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                  ))}
                                </div>

                                <FakeDash />

                                <div className="flex">
                                  {slots.slice(2).map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                  ))}
                                </div>
                              </>
                            )}
                          />
                        </FormControl>
                        <FormMessage className="w-full pt-2 text-center" />
                      </FormItem>
                    </div>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !form.formState.isValid}
                  isLoading={isLoading}
                >
                  Verify
                </Button>
              </form>
            </Form>

            <AuthResendButton />
          </div>
        </AuthShell>
      )}
    </AuthOneTimePassCode>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative h-14 w-10 text-[2rem]",
        "flex items-center justify-center",
        "duration-50 transition-all",
        "border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md",
        "group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        { "outline-1 outline-accent-foreground": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center">
      <div className="h-8 w-px bg-white" />
    </div>
  )
}

function FakeDash() {
  return (
    <div className="flex w-10 items-center justify-center">
      <div className="h-1 w-3 rounded-full bg-border" />
    </div>
  )
}
