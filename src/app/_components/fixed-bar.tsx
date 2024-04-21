import { cn } from "~/lib/utils/functions/ui"

interface FixedBarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

export default function FixedBar({ ...props }: FixedBarProps) {
  const {} = props

  return (
    <section
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 flex w-full flex-col justify-center bg-white shadow-[0px_-11px_33px_5px_#e2e8f0]",
        props.className,
      )}
    >
      {props.children}
    </section>
  )
}
