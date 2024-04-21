import { getProductCategories } from "~/lib/modules/product/utils/product-apis"
import SideBarWrapper from "./side-bar-wrapper"

interface SideBarRendererProps extends React.HTMLAttributes<HTMLElement> {}

export default async function SideBarRenderer({
  ...props
}: SideBarRendererProps) {
  const {} = props
  const categories = await getProductCategories()

  return <SideBarWrapper categories={categories} />
}
