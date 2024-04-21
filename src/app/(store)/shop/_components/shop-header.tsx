"use client"

import { useShopContext } from "~/lib/modules/shop/utils/shop-context"

interface ShopHeaderProps extends React.HTMLAttributes<HTMLElement> {}

export default function ShopHeader({ ...props }: ShopHeaderProps) {
  const {} = props

  const { title } = useShopContext()

  return (
    <div className="border-b bg-slate-50">
      <div className="container py-8">
        <div className="mb-1 text-sm text-muted-foreground">
          Showing results for:
        </div>
        <div className="text-xl font-medium capitalize">{title}</div>
      </div>
    </div>
  )
}
