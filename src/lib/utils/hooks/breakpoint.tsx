"use client"

import { Suspense } from "react"
import { createBreakpoint } from "react-use"

const breakPoints = { XL: 1280, LG: 1024, MD: 768, SM: 640 }

const useBreak = createBreakpoint(breakPoints)

export type UseBreakpointOutputType = ReturnType<typeof useBreakpoint>

export interface BreakpointProps extends React.HTMLAttributes<HTMLElement> {
  screen: keyof typeof breakPoints
  reverse?: boolean
  fallback?: React.ReactNode
  suspense?: boolean
}

export function Breakpoint({ ...props }: BreakpointProps) {
  const breakpoint = useBreak() as keyof typeof breakPoints

  if (
    props.reverse ? breakpoint !== props.screen : breakpoint === props.screen
  ) {
    return (
      <>
        {props.suspense && (
          <Suspense fallback={props.fallback}>{props.children}</Suspense>
        )}

        {!props.suspense && props.children}
      </>
    )
  }
}

export function useBreakpoint() {
  return useBreak() as keyof typeof breakPoints
}
