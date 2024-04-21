import { cn } from "~/lib/utils/functions/ui"

interface AccountSectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  sub: string
  disableBack?: boolean
}

export default function AccountSectionWrapper({
  ...props
}: AccountSectionWrapperProps) {
  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-10">
      <div className={cn("container", props.className)}>
        <div className="mb-8 border-b py-4 md:px-0">
          <div className="text-lg font-semibold">{props.title}</div>

          <div className="text-sm text-muted-foreground">{props.sub}</div>
        </div>

        {props.children}
      </div>
    </div>
  )
}
