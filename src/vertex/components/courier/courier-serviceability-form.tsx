import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { useCookie } from "react-use"
import { courierPostcodeAction } from "~/vertex/lib/server/server-actions"
import { useActionHandler } from "~/vertex/lib/server/server-hook"
import { $IndianPostcode, type IndianPostcode } from "~/vertex/modules/courier/courier-models"
import { type Serviceability } from "~/vertex/modules/courier/courier-types"

interface CourierServiceabilityFormProps {
  onSuccess?: () => void
  children: (props: ReturnType<typeof useCourierServiceabilityForm>) => React.ReactNode
}

export function CourierServiceabilityForm({ ...props }: CourierServiceabilityFormProps) {
  const {} = props

  const values = useCourierServiceabilityForm(props)

  return (
    <FormProvider {...values.form}>
      <form onSubmit={values.formHandler}>{props.children(values)}</form>
    </FormProvider>
  )
}

export function useCourierServiceabilityForm(props: Omit<CourierServiceabilityFormProps, "children">) {
  const [cookieValue] = useCookie("_postcode")

  const data = cookieValue ? (JSON.parse(cookieValue) as Serviceability) : null

  const form = useForm<IndianPostcode>({
    resolver: zodResolver($IndianPostcode),
    defaultValues: { postcode: data?.postcode },
  })

  const action = useActionHandler(courierPostcodeAction, {
    onSuccess: () => {
      props?.onSuccess ? props?.onSuccess() : null
    },

    onError: (error) => {
      console.log({ error })
      form.setError("postcode", { message: error.message })
    },
  })

  const mutate = (input: IndianPostcode) => {
    if (data?.postcode === input.postcode) {
      return props?.onSuccess ? props?.onSuccess() : null
    }

    action.mutate(input)
  }

  const formHandler = form.handleSubmit(mutate)

  const isLoading = action.isLoading

  const isFormComplete = form.formState.isValid

  const postcodeFieldController = {} satisfies React.InputHTMLAttributes<HTMLInputElement>

  const isPostcodeSet = !!data?.postcode

  return {
    form,
    formHandler,
    mutate,
    isLoading,
    isFormComplete,
    postcodeFieldController,
    isPostcodeSet,
  }
}
