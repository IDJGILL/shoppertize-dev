import { ShieldCheckIcon } from "lucide-react"
import { cn } from "~/lib/utils/functions/ui"

export default function SecureBadge({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium",
        props.className,
      )}
    >
      <ShieldCheckIcon className="h-10 w-10 fill-green-600 stroke-white" />{" "}
      <div>
        <div className="text-green-600">Secured with</div>
        <div className="font-mono text-xs text-muted-foreground">
          256-bit SSL Encryption
        </div>
      </div>
    </div>
  )
}
