import { Button } from "~/app/_components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form"
import { Input, Password } from "~/app/_components/ui/input"
import AuthShell from "./auth-shell"
import { AuthSignup } from "~/vertex/modules/auth/auth-signup"

interface AuthSignUpFormProps extends React.HTMLAttributes<HTMLElement> {}

export default function AuthSignUpForm({ ...props }: AuthSignUpFormProps) {
  const {} = props

  return (
    <AuthSignup>
      {({ form, mutate, isLoading }) => (
        <AuthShell>
          <Form {...form}>
            <form onSubmit={mutate} className="w-full space-y-5">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input placeholder=" " {...field} type="hidden" autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormControl>
                        <Input placeholder=" " {...field} />
                      </FormControl>

                      <FormLabel>Name</FormLabel>
                    </FormItem>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <div>
                    <FormItem>
                      <FormControl>
                        <Password
                          field={{ ...field }}
                          form={form}
                          toggle={true}
                          placeholder="Create Password"
                          showPasswordStrength={false}
                        />
                      </FormControl>
                    </FormItem>

                    <FormDescription className="mt-2">
                      Tip: It must be at least 9 characters long and contain letters and digits.
                    </FormDescription>

                    <FormMessage />
                  </div>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !form.formState.isValid}
                isLoading={isLoading}
              >
                Create an Account
              </Button>
            </form>
          </Form>
        </AuthShell>
      )}
    </AuthSignup>
  )
}
