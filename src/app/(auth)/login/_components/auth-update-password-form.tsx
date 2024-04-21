import { Button } from "~/app/_components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input, Password } from "~/app/_components/ui/input"
import { AuthUpdatePassword } from "~/vertex/components/auth/auth-update-password"
import AuthShell from "./auth-shell"

interface AuthUpdatePasswordFormProps
  extends React.HTMLAttributes<HTMLElement> {}

export default function AuthUpdatePasswordForm({
  ...props
}: AuthUpdatePasswordFormProps) {
  const {} = props

  return (
    <AuthUpdatePassword>
      {({ form, mutate, isLoading }) => (
        <AuthShell>
          <Form {...form}>
            <form onSubmit={mutate} className="w-full space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder=" "
                        {...field}
                        type="hidden"
                        autoComplete="off"
                      />
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

              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
                loading={isLoading ? "true" : "false"}
              >
                Update Password
              </Button>
            </form>
          </Form>
        </AuthShell>
      )}
    </AuthUpdatePassword>
  )
}
