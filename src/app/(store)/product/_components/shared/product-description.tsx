import { cn } from "~/lib/utils/functions/ui"
import parse from "html-react-parser"
import Divider from "./section-divider"
import { type ProductExtraData } from "../../[slug]/page"
import Link from "next/link"

interface ProductDescriptionProps extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

export default function ProductDescription({
  ...props
}: ProductDescriptionProps) {
  const {
    extraData: { description },
  } = props

  if (!description.title || !description.html) return null

  return (
    <>
      <Divider className="my-8" />

      <div className="px-4 md:px-0">
        <h3 className="mb-4 text-base ">{parse(description.title)}</h3>

        <div className={cn("text-sm", props.className)}>
          {parse(description.html)}
        </div>

        <div className="mt-4 text-sm font-medium">
          *Please note that, due to the nature of this item, it is
          non-returnable and non-refundable. For more details, please refer to
          our
          <Link href="/policy/returns-and-exchange" className="link">
            Return Policy
          </Link>
        </div>
      </div>
    </>
  )
}
