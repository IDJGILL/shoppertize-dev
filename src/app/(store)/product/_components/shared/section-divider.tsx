import { cn } from "~/lib/utils/functions/ui"

export default function Divider({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={cn(
        "my-4 h-2 bg-zinc-100 lg:h-[1px] lg:border-b",
        props.className,
      )}
    ></div>
  )
}
