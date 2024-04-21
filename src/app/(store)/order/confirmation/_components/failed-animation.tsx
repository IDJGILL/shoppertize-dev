"use client"

import { motion } from "framer-motion"
import { useLottie } from "lottie-react"
import PaymentFailed from "~/assets/lottie/payment-failed.json"

interface FailedAnimationProps extends React.HTMLAttributes<HTMLElement> {}

export default function FailedAnimation({ ...props }: FailedAnimationProps) {
  const {} = props

  const { View } = useLottie({
    animationData: PaymentFailed,
    loop: false,
    size: 100,
  })

  return (
    <motion.div className="mx-auto mb-5 aspect-square max-w-[140px]">
      {View}
    </motion.div>
  )
}
