import { ModelXDrawer } from "~/app/_components/ui/dialog"
import { cn } from "~/lib/utils/functions/ui"
import { type SortedCoupon } from "../utils/coupon-types"
import { Button } from "~/app/_components/ui/button"
import Box from "~/app/_components/box"
import { ArrowRight, BadgeCheck, BadgePercent, ChevronRight } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/app/_components/ui/form"
import { Input } from "~/app/_components/ui/input"
import { ScrollArea } from "~/app/_components/ui/scroll-area"
import { currency } from "~/constants"
import CouponContextProvider, { useCouponContext } from "./coupon-context"
import { formatPrice } from "~/lib/utils/functions/format-price"
import Spinner from "~/app/_components/ui/spinner"
import { useEffect, useCallback } from "react"
import { useBreakpoint } from "~/lib/utils/hooks/breakpoint"

interface ApplyCouponProps extends React.HTMLAttributes<HTMLElement> {
  sortedCoupon: SortedCoupon[]
  summary: OnlineSummary
}

export default function ApplyCoupon({ ...props }: ApplyCouponProps) {
  const { sortedCoupon, summary } = props

  return (
    <CouponContextProvider sortedCoupon={sortedCoupon} summary={summary}>
      <CouponSection />

      <Drawer />

      <Success />
    </CouponContextProvider>
  )
}

interface CouponSectionProps extends React.HTMLAttributes<HTMLElement> {}

function CouponSection({ ...props }: CouponSectionProps) {
  const {} = props

  const { eligibleCoupon, isApplied, isModalOpenSet, summary, removeCoupon, applyCoupon, isLoading } =
    useCouponContext()

  return (
    <Box className="p-0">
      {!eligibleCoupon && !isApplied && (
        <div className="flex flex-col justify-center font-medium">
          {/* When don't have eligible coupon */}
          <div
            className="flex h-14 cursor-pointer items-center justify-between pl-4"
            onClick={() => isModalOpenSet(true)}
          >
            <div className="flex items-center gap-4 text-sm">
              <BadgePercent className="w-5" /> Apply Coupon
            </div>

            <Button variant="icon">
              <ArrowRight className="w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      )}

      {eligibleCoupon && !isApplied && (
        <div className="flex flex-col justify-center font-medium">
          {/* When have eligible coupon */}
          <div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex gap-4">
                <BadgePercent className="w-5 text-primary" />
                <div className="text-left">
                  <div className="text-sm">
                    Save{" "}
                    {formatPrice({
                      price: eligibleCoupon.amount,
                      prefix: eligibleCoupon.discountType === "FIXED_CART" ? "₹" : undefined,
                      suffix: eligibleCoupon.discountType === "PERCENT" ? "%" : undefined,
                    })}{" "}
                    more on this order
                  </div>
                  <div className="text-xs text-muted-foreground">CODE: {eligibleCoupon.code.toUpperCase()}</div>
                </div>
              </div>

              <Button
                size="sm"
                variant="link"
                className="px-0 font-medium !no-underline"
                onClick={() => applyCoupon(eligibleCoupon.code)}
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="stroke-black" /> : "Apply"}
              </Button>
            </div>

            <Button
              size="sm"
              variant="link"
              className="w-full rounded-none border-t text-muted-foreground !no-underline"
              onClick={() => isModalOpenSet(true)}
            >
              View all coupons <ChevronRight className="mt-[1px] w-4" />
            </Button>
          </div>
        </div>
      )}

      {!!summary.coupon && (
        <div className="flex flex-col justify-center font-medium">
          {/* When coupon applied */}
          <div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex gap-4">
                <BadgeCheck className="w-5 text-primary" />
                <div className="text-left">
                  <div className="text-sm">
                    You saved ₹
                    {formatPrice({
                      price: summary.coupon.couponDiscount.toString(),
                    })}{" "}
                    with this code🎉
                  </div>
                  <div className="text-xs text-muted-foreground">Coupon Applied</div>
                </div>
              </div>

              <Button
                size="sm"
                variant="link"
                className="px-0 pt-0 font-medium text-destructive !no-underline"
                onClick={() => removeCoupon()}
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="stroke-black" /> : "Remove"}
              </Button>
            </div>

            <Button
              size="sm"
              variant="link"
              className="w-full rounded-none border-t text-muted-foreground !no-underline"
              onClick={() => isModalOpenSet(true)}
            >
              View all coupons <ChevronRight className="mt-[1px] w-4" />
            </Button>
          </div>
        </div>
      )}
    </Box>
  )
}

function Drawer() {
  const { isModalOpen, isModalOpenSet, form, handleSubmit, coupons, isLoading } = useCouponContext()

  return (
    <ModelXDrawer open={isModalOpen} onOpenChange={isModalOpenSet} className="md:max-w-md" title="Offers">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="border-b">
            <div className="pb-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Enter coupon code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Coupons */}
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col space-y-4 py-5 text-left">
              {coupons
                .sort((a, b) => (a.isEligible === b.isEligible ? 0 : a.isEligible ? -1 : 1))
                .map((coupon) => (
                  <CouponCard key={coupon.code} coupon={coupon} />
                ))}

              <div className=" p-4 text-center text-sm text-muted-foreground">Keep shopping for more!</div>
            </div>
          </ScrollArea>

          <div className="w-full bg-white">
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </ModelXDrawer>
  )
}

interface CouponCardProps extends React.HTMLAttributes<HTMLElement> {
  coupon: SortedCoupon
}

function CouponCard({ ...props }: CouponCardProps) {
  const { coupon } = props

  const { applyCoupon, summary } = useCouponContext()

  return (
    <div
      className={cn("flex min-h-[140px] overflow-hidden rounded-2xl bg-white shadow-[0px_5px_20px_0px_#e2e8f0]", {
        "select-none opacity-80 grayscale": !coupon.isEligible,
      })}
    >
      <div className={cn("relative flex w-12 items-center justify-center bg-primary")}>
        <div className="max-w-max -rotate-90 whitespace-nowrap font-extrabold uppercase leading-none text-white">
          Flat off
        </div>

        <div className="absolute -left-[4px] space-y-3">
          <div className="h-2 w-2 rounded-full bg-slate-100"></div>
          <div className="h-2 w-2 rounded-full bg-slate-100"></div>
          <div className="h-2 w-2 rounded-full bg-slate-100"></div>
          <div className="h-2 w-2 rounded-full bg-slate-100"></div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="uppercase">{coupon.code}</div>

            <div className="text-sm text-primary">
              Save {}
              {formatPrice({
                price: coupon.amount.toString(),
                prefix: coupon.discountType === "FIXED_CART" ? "₹" : undefined,
                suffix: coupon.discountType === "PERCENT" ? "%" : undefined,
              })}{" "}
              on this order!
            </div>
          </div>

          {coupon.isEligible && (
            <Button
              type="button"
              variant="link"
              className="pr-2 pt-0 text-sm !no-underline"
              onClick={() => applyCoupon(coupon.code)}
              disabled={summary.coupon?.couponCode === coupon.code}
            >
              {summary.coupon?.couponCode === coupon.code ? "Applied" : "Apply"}
            </Button>
          )}
        </div>

        <div className="mb-3 mt-4 h-1 w-full border-t border-dashed border-gray-300"></div>

        <div className="mb-3 max-w-[80%] text-xs text-muted-foreground">
          {coupon.isEligible ? <div>{coupon.description}</div> : <div>{coupon.eligibilityMessage}</div>}
        </div>
      </div>
    </div>
  )
}

function Success() {
  const { summary, isSuccess, isSuccessSet } = useCouponContext()

  const screen = useBreakpoint()

  const showConfetti = useCallback(async () => {
    const confetti = await import("canvas-confetti")

    async function fire(particleRatio: number, opts: confetti.Options) {
      if (!isSuccess) return

      await confetti.default({
        origin: { y: screen !== "SM" ? 0.4 : 1 },
        ...opts,
        particleCount: Math.floor(240 * particleRatio),
      })
    }

    await Promise.all([
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      }),
      fire(0.2, {
        spread: 60,
      }),
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      }),
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      }),
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      }),
    ])
  }, [isSuccess, screen])

  useEffect(() => void showConfetti(), [isSuccess, showConfetti])

  if (!!!summary.coupon) return null

  return (
    <ModelXDrawer open={isSuccess} onOpenChange={isSuccessSet} className="md:max-w-md" hideBackdrop>
      <div className=" z-40 flex flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 text-2xl font-semibold">
          You saved {currency}
          {formatPrice({ price: summary.coupon.couponDiscount.toString() })}
        </p>

        <p className="mb-8 text-sm">with this coupon code</p>

        <Button className="w-full" onClick={() => isSuccessSet(false)}>
          Woohoo! Thanks
        </Button>
      </div>
    </ModelXDrawer>
  )
}
