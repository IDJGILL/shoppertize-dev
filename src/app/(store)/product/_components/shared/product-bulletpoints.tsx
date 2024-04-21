import { cn } from "~/lib/utils/functions/ui"
import parse from "html-react-parser"
import { type ProductExtraData } from "../../[slug]/page"

interface ProductBulletPointsProps extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

export default function ProductBulletPoints({
  ...props
}: ProductBulletPointsProps) {
  const {
    extraData: { bulletPoint },
  } = props

  if (!bulletPoint.title || !bulletPoint.html) return null

  return (
    <div>
      <h3 className="mb-4 text-base ">{parse(bulletPoint.title)}</h3>

      <div
        className={cn(
          "pl-4 text-sm [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:leading-6",
          props.className,
        )}
      >
        {parse(bulletPoint.html)}
      </div>
    </div>
  )
}
