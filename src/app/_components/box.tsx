import { cn } from "~/lib/utils/functions/ui"

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
}

export default function Box({ ...props }: BoxProps) {
  const {} = props

  return (
    <section
      onClick={props.onClick}
      className={cn(
        "mb-3 overflow-hidden bg-white p-4 md:rounded-sm md:border md:p-5",
        props.className,
      )}
      id={props.id}
    >
      {props.title && (
        <h3 className="z-10 mb-4 flex items-center gap-2 px-0 text-sm font-semibold md:text-base">
          {props.title}
        </h3>
      )}

      {props.children}
    </section>
  )
}
