"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "~/app/_components/ui/form"
import { Input, Password } from "~/app/_components/ui/input"
import { Button } from "~/app/_components/ui/button"
import AuthShell from "./auth-shell"
import { AuthLogin } from "~/vertex/components/auth/auth-login"
import { AuthForgetPassword } from "~/vertex/components/auth/auth-forget-password"
import AuthSocialLoginButtons from "./auth-social-login-buttons"

interface AuthLoginFromProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthLoginFrom({ ...props }: AuthLoginFromProps) {
  const {} = props

  return (
    <AuthLogin>
      {({ mutate, form, isLoading }) => (
        <AuthShell>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={mutate} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder=" " {...field} type="hidden" autoComplete="off" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Password
                          toggle={true}
                          form={form}
                          field={{ ...field }}
                          placeholder="Password"
                          showPasswordStrength={false}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Continue
                </Button>
              </form>
            </Form>

            <AuthSocialLoginButtons />

            <AuthForgetPassword>
              {({ mutate: mutateForget, isLoading }) => (
                <div className="mt-2 flex w-full items-center justify-center">
                  <button type="button" onClick={() => mutateForget()} className="py-4 text-sm text-primary">
                    {isLoading ? "Requesting..." : "Forgot your password?"}
                  </button>
                </div>
              )}
            </AuthForgetPassword>
          </div>
        </AuthShell>
      )}
    </AuthLogin>
  )
}
