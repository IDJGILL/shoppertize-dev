"use client"

import { useCheckoutContext } from "~/lib/modules/checkout/checkout-context"
import { RadioGroup, RadioGroupItem } from "~/app/_components/ui/radio-group"
import { cn } from "~/lib/utils/functions/ui"

interface PaymentSectionProps extends React.HTMLAttributes<HTMLElement> {}

export default function PaymentSection({ ...props }: PaymentSectionProps) {
  const {} = props

  const { paymentMethodProps, data, paymentMethod } = useCheckoutContext()

  if (!data) return null

  const { paymentOptions } = data

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Choose a Payment Method</h2>

      <RadioGroup {...paymentMethodProps}>
        {paymentOptions.map((a) => (
          <label
            key={a.type}
            htmlFor={a.type}
            className={cn(
              "flex cursor-pointer items-center space-x-4 rounded-md border bg-white p-4 py-4 shadow",
              {
                "border-primary": paymentMethod === a.type,
                "cursor-not-allowed opacity-80": !a.isEligible,
              },
            )}
          >
            <RadioGroupItem
              value={a.type}
              id={a.type}
              disabled={!a.isEligible}
            />

            <div>
              <h4 className="font-medium tracking-tight">{a.label}</h4>
              <p className="text-xs">{a.description}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
