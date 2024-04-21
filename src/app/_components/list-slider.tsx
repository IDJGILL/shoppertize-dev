import { type ComponentType } from "react"
import { cn } from "~/lib/utils/functions/ui"

interface ListSliderProps extends React.HTMLAttributes<HTMLElement> {
  List: ComponentType
}

export default function ListSlider({ ...props }: ListSliderProps) {
  const { List } = props

  return (
    <div
      className={cn(
        " overflow-x-auto overflow-y-hidden whitespace-nowrap pl-4",
        props.className,
      )}
    >
      <List />
    </div>
  )
}
