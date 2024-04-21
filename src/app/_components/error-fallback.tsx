"use client"

import { cn } from "~/lib/utils/functions/ui"
import { Button } from "./ui/button"

interface ErrorFallbackProps extends React.HTMLAttributes<HTMLElement> {
  options: {
    title?: string
    sub?: string
    buttonLabel?: string
    buttonLink?: string
    fullScreen?: boolean
  }
}

export default function ErrorFallback({ ...props }: ErrorFallbackProps) {
  const { options } = props

  return (
    <section
      className={cn(
        "flex h-full w-full items-center justify-center px-4",
        {
          "h-screen w-full": options?.fullScreen,
        },
        props.className,
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-3 text-3xl  tracking-tight">
          {options?.title ?? "Something went wrong"}
        </h2>

        <p className="mb-7 max-w-sm text-center font-medium text-muted-foreground">
          {options?.sub ??
            "There is an unforeseen error; please check your internet connection or try again after some time."}
        </p>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (options?.buttonLink) {
              window.location.href = options?.buttonLink
            } else {
              window.location.reload()
            }
          }}
        >
          {options?.buttonLabel ?? "Try again"}
        </Button>
      </div>
    </section>
  )
}
