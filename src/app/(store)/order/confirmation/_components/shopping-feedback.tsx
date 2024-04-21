"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/app/_components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/_components/ui/form"
import Rating from "~/app/_components/ui/rating"
import { Textarea } from "~/app/_components/ui/textarea"
import {
  ShoppingFeedbackSchema,
  type ShoppingFeedbackSchemaProps,
} from "~/lib/modules/review/utils/review-schemas"
import { api } from "~/lib/server/access/client"

interface ShoppingFeedbackProps extends React.HTMLAttributes<HTMLElement> {}

export default function ShoppingFeedback({ ...props }: ShoppingFeedbackProps) {
  const {} = props
  const [rating, ratingSet] = useState<number>(0)
  const [feedbackSuccess, feedbackSuccessSet] = useState(false)

  const form = useForm<ShoppingFeedbackSchemaProps>({
    resolver: zodResolver(ShoppingFeedbackSchema),
  })

  const { mutate, isLoading } = api.review.addFeedback.useMutation({
    onSuccess: (response) => {
      if (!response.success) {
        return
      }

      feedbackSuccessSet(true)
    },
  })

  const formHandler = form.handleSubmit((data) => mutate(data))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
      className="mx-auto mb-20 w-full rounded border bg-slate-50 py-20 text-center"
    >
      {!feedbackSuccess && (
        <>
          <h4 className="mb-2 text-center text-lg font-medium tracking-tight">
            Rate Your Shopping Experience
          </h4>

          <p className="text-muted-foreground">
            Please tell us how we can improve.
          </p>

          <div className="mx-auto flex max-w-md flex-col">
            <Form {...form}>
              <form onSubmit={formHandler} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="mx-auto mt-6 w-max">
                          <Rating
                            type="dynamic"
                            onRatingChange={(rating) => {
                              field.onChange(rating)
                              ratingSet(rating)
                            }}
                            default={0}
                            className="mx-auto h-10 w-10"
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {rating !== 0 && rating < 3 ? (
                          <Textarea
                            {...field}
                            placeholder="What went wrong? (Optional)"
                            className="mt-4 w-full"
                          />
                        ) : null}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {rating >= 1 ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-8 hover:bg-slate-100"
                    loading={isLoading ? "true" : "false"}
                  >
                    Submit Feedback
                  </Button>
                ) : null}
              </form>
            </Form>
          </div>
        </>
      )}

      {feedbackSuccess && (
        <div>
          <h4 className="mb-2 text-center text-lg font-medium tracking-tight">
            Thanks You
          </h4>

          <p className="text-muted-foreground">
            Your feedback will help us make the change.
          </p>
        </div>
      )}
    </motion.div>
  )
}
