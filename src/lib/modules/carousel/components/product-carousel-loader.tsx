interface ProductCarouselLoaderProps
  extends React.HTMLAttributes<HTMLElement> {}

export default function ProductCarouselLoader({
  ...props
}: ProductCarouselLoaderProps) {
  const {} = props

  return (
    <div className="container h-[360px] w-full rounded bg-slate-200 text-center">
      Loading...
    </div>
  )
}
