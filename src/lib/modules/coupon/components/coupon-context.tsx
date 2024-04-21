import {
  type BaseSyntheticEvent,
  createContext,
  useState,
  useContext,
} from "react"
import { type SortedCoupon } from "../utils/coupon-types"
import { type UseFormReturn, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ApplyCouponSchema,
  type ApplyCouponSchemaProps,
} from "../utils/coupon-schemas"
import { api } from "~/lib/server/access/client"
import { toast } from "sonner"

type CouponContextProps = {
  form: UseFormReturn<
    {
      code: string
    },
    unknown,
    undefined
  >
  handleSubmit: (
    e?: BaseSyntheticEvent<object, unknown, unknown> | undefined,
  ) => Promise<void>
  isApplied: boolean
  isLoading: boolean
  isModalOpen: boolean
  isSuccess: boolean
  isModalOpenSet: (a: boolean) => void
  isSuccessSet: (a: boolean) => void
  eligibleCoupon: SortedCoupon | undefined
  coupons: SortedCoupon[]
  summary: OnlineSummary
  removeCoupon: () => void
  refresh: () => Promise<void>
  applyCoupon: (code: string) => void
}

const CouponContext = createContext<CouponContextProps | null>(null)

interface CouponContextProviderProps extends React.HTMLAttributes<HTMLElement> {
  sortedCoupon: SortedCoupon[]
  summary: OnlineSummary
}

export default function CouponContextProvider({
  ...props
}: CouponContextProviderProps) {
  const { sortedCoupon, summary } = props

  const [isModalOpen, isModalOpenSet] = useState(false)

  const [isSuccess, isSuccessSet] = useState(false)

  const coupons = sortedCoupon.sort((a, b) => {
    return a.isEligible === b.isEligible ? 0 : a.isEligible ? -1 : 1
  })

  const eligibleCoupon = coupons.find((coupon) => coupon.isEligible)

  const isApplied = !!summary.coupon

  const apiContext = api.useContext()

  const form = useForm<ApplyCouponSchemaProps>({
    resolver: zodResolver(ApplyCouponSchema),
  })

  const refresh = () => apiContext.checkout.session.invalidate()

  const { mutate, isLoading: isApplying } = api.store.coupon.apply.useMutation({
    onSuccess: async (response) => {
      if (!response.success) {
        toast.error(response.message)

        return form.setError("code", {
          type: "custom",
          message: response.message,
        })
      }

      await refresh()

      isSuccessSet(true)
      isModalOpenSet(false)
    },
  })

  const { mutate: remove, isLoading: isRemoving } =
    api.store.coupon.remove.useMutation({
      onSuccess: async () => {
        await refresh()
        toast.success("Coupon removed")
      },
    })

  const removeCoupon = () => remove()

  const handleSubmit = form.handleSubmit((data) => mutate(data))

  const applyCoupon = (code: string) => mutate({ code })

  const values = {
    form,
    isLoading: isApplying || isRemoving,
    handleSubmit,
    isSuccess,
    isSuccessSet,
    isModalOpen,
    isModalOpenSet,
    isApplied,
    eligibleCoupon,
    coupons,
    summary,
    removeCoupon,
    refresh,
    applyCoupon,
  }

  return (
    <CouponContext.Provider value={values}>
      {props.children}
    </CouponContext.Provider>
  )
}

export const useCouponContext = () => {
  const context = useContext(CouponContext)

  if (!context) {
    throw new Error("Context been used out of provider")
  }

  return context
}
