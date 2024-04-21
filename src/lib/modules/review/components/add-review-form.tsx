import { zodResolver } from "@hookform/resolvers/zod"
import { type UseFormReturn, useForm } from "react-hook-form"
import Rating from "~/app/_components/ui/rating"
import {
  AddReviewSchema,
  type AddReviewSchemaProps,
} from "../utils/review-schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/_components/ui/form"
import { Button } from "~/app/_components/ui/button"
import { Input } from "~/app/_components/ui/input"
import { Textarea } from "~/app/_components/ui/textarea"
import { useEffect } from "react"

export type ReviewFormInstance = UseFormReturn<
  AddReviewSchemaProps,
  unknown,
  undefined
>

interface AddReviewFormProps extends React.HTMLAttributes<HTMLElement> {
  orderId: number
  productId: number
  onFormSubmit: (data: AddReviewSchemaProps) => void
  isLoading: boolean
  onFormMount?: (instance: ReviewFormInstance) => void
}

export default function AddReviewForm({ ...props }: AddReviewFormProps) {
  const {} = props

  const form = useForm<AddReviewSchemaProps>({
    resolver: zodResolver(AddReviewSchema),
  })

  const formHandler = form.handleSubmit((input) => props.onFormSubmit(input))

  useEffect(() => {
    if (!props.onFormMount) return

    props.onFormMount(form)
  }, [form, props])

  return (
    <Form {...form}>
      <form onSubmit={formHandler} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          defaultValue={props.productId}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder=" "
                  {...field}
                  type="hidden"
                  className="hidden"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderId"
          defaultValue={props.orderId}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder=" "
                  {...field}
                  type="hidden"
                  className="hidden"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="flex items-center justify-center md:justify-start">
              <FormControl>
                <Rating
                  type="dynamic"
                  onRatingChange={(rating) => field.onChange(rating)}
                  default={0}
                  className="mx-auto h-10 w-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Please share your thoughts on this product."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={props.isLoading || !form.formState.isValid}
          loading={props.isLoading ? "true" : "false"}
        >
          Submit Review
        </Button>
      </form>
    </Form>
  )
}
