"use client"

import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import useBackRouter from "~/lib/utils/hooks/useBackRouter"

interface HeaderBackNavigatorProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

export default function HeaderBackNavigator({
  ...props
}: HeaderBackNavigatorProps) {
  const { title } = props
  const { getBackPath, handleBack, path } = useBackRouter()

  return path !== "/" ? (
    <div className="inline-flex items-center">
      <Link
        href={getBackPath()}
        className="inline-flex size-14 items-center justify-center gap-4 md:hidden"
        onClick={() => handleBack()}
      >
        <ArrowLeftIcon className="w-5" />
      </Link>

      {title ? <span className="sm:hidden">{title}</span> : null}
    </div>
  ) : null
}
