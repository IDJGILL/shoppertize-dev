"use client"

import { motion } from "framer-motion"
import { useLottie } from "lottie-react"
import SuccessCheck from "~/assets/lottie/success-check.json"

interface SuccessAnimationProps extends React.HTMLAttributes<HTMLElement> {}

export default function SuccessAnimation({ ...props }: SuccessAnimationProps) {
  const {} = props

  const { View } = useLottie({
    animationData: SuccessCheck,
    loop: false,
    size: 100,
  })

  return (
    <motion.div className="mx-auto mb-5 aspect-square max-w-[140px]">
      {View}
    </motion.div>
  )
}
