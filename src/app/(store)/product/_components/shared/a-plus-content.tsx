import parse from "html-react-parser"
import { cn } from "~/lib/utils/functions/ui"
import Divider from "./section-divider"
import { type ProductExtraData } from "../../[slug]/page"

interface APlusContentProps extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

export default function APlusContent({ ...props }: APlusContentProps) {
  const {
    extraData: { aPlusContent },
  } = props

  if (!aPlusContent.title || !aPlusContent.html) return null

  return (
    <>
      <Divider className="my-8" />

      <div className="mx-auto max-w-4xl">
        <h3 className="mb-4 text-base ">{parse(aPlusContent.title)}</h3>

        <div className={cn("text-sm [&_img]:w-full", props.className)}>
          {parse(aPlusContent.html)}
        </div>
      </div>
    </>
  )
}
