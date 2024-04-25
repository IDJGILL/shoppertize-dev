import { cn } from "~/lib/utils/functions/ui"

interface AppLoaderProps extends React.HTMLAttributes<HTMLElement> {}

export default function AppLoader({ ...props }: AppLoaderProps) {
  const {} = props

  return (
    <div className={cn("flex h-screen w-full items-center justify-center", props.className)}>
      <div className="app-loader"></div>
    </div>
  )
}
