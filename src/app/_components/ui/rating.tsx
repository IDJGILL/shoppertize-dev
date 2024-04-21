"use client"
import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "~/lib/utils/functions/ui"

interface RatingProps extends React.HTMLAttributes<HTMLElement> {
  type: "static" | "dynamic"
  onRatingChange?: (rating: number) => void
  default: number
}

export default function Rating({ ...props }: RatingProps) {
  const defaultActiveStars = Math.min(5 - Math.round(props.default), 5)

  const [selected, setSelected] = useState(defaultActiveStars)

  const handleRatingChange = (star: number) => {
    if (props.type === "static") return

    setSelected(star)
    props?.onRatingChange && props.onRatingChange(5 - star)
  }

  return (
    <div className="flex max-w-max flex-row-reverse justify-center">
      {Array(5)
        .fill(" ")
        .map((s, index) => (
          <Star
            key={index}
            className={cn(
              "peer fill-zinc-200 stroke-none",
              {
                "fill-secondary": selected <= index,
                "peer cursor-pointer hover:fill-secondary peer-hover:fill-secondary":
                  props.type === "dynamic",
              },
              props.className,
            )}
            onClick={() => handleRatingChange(index)}
          />
        ))}
    </div>
  )
}
