import { Button } from "~/app/_components/ui/button"
import { Form, FormField } from "~/app/_components/ui/form"
import EmailAndPhoneInput from "./email-and-phone-input"
import { Input } from "~/app/_components/ui/input"
import AuthShell from "./auth-shell"
import { AuthIdentify } from "~/vertex/components/auth"
import AuthSocialLoginButtons from "./auth-social-login-buttons"

interface AuthIdentifyForm extends React.HTMLAttributes<HTMLElement> {}

export default function AuthIdentifyForm({ ...props }: AuthIdentifyForm) {
  const {} = props

  return (
    <AuthIdentify>
      {({ form, mutate, isLoading }) => (
        <AuthShell>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={mutate} className="space-y-4">
                <FormField
                  control={form.control}
                  name="countryCode"
                  defaultValue=""
                  render={({ field }) => <Input type="hidden" {...field} className="hidden" />}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => <EmailAndPhoneInput inputProps={field} form={form} />}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Continue
                </Button>
              </form>
            </Form>

            <AuthSocialLoginButtons />
          </div>
        </AuthShell>
      )}
    </AuthIdentify>
  )
}
