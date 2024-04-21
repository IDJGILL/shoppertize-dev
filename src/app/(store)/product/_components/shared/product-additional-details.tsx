import { cn } from "~/lib/utils/functions/ui"
import parse from "html-react-parser"
import { type ProductExtraData } from "../../[slug]/page"
import Divider from "./section-divider"

interface ProductAdditionDetailsProps
  extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

export default function ProductAdditionDetails({
  ...props
}: ProductAdditionDetailsProps) {
  const { extraData } = props

  if (
    !extraData.additionalDetailsRight.html ||
    !extraData.additionalDetailsLeft.html
  ) {
    return null
  }

  return (
    <>
      <Divider className="my-8" />

      <div className="flex flex-col justify-between gap-8 text-left md:flex-row md:gap-4 [&_table]:w-full [&_table]:table-auto [&_table]:border-collapse [&_table]:rounded [&_table]:border [&_table]:text-sm [&_td]:px-4 [&_td]:py-2 [&_th]:border-b [&_th]:border-r [&_th]:bg-zinc-50 [&_th]:px-4 [&_th]:py-2 [&_th]:font-normal [&_tr]:border-b">
        <Left extraData={extraData} />
        <Right extraData={extraData} />
      </div>
    </>
  )
}

interface LeftProps extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

function Left({ ...props }: LeftProps) {
  const { additionalDetailsLeft } = props.extraData

  if (!additionalDetailsLeft.title || !additionalDetailsLeft.html) return null

  return (
    <div className="flex-1 px-4 md:px-0">
      <h3 className="mb-4 text-base ">{parse(additionalDetailsLeft.title)}</h3>

      <div className={cn(props.className)}>
        {parse(additionalDetailsLeft.html)}
      </div>
    </div>
  )
}

interface RightProps extends React.HTMLAttributes<HTMLElement> {
  extraData: ProductExtraData
}

function Right({ ...props }: RightProps) {
  const { additionalDetailsRight } = props.extraData

  if (!additionalDetailsRight.title || !additionalDetailsRight.html) {
    return <div className="flex-1"></div>
  }

  return (
    <div className="flex-1 px-4 md:px-0">
      <h3 className="mb-4 text-base ">{parse(additionalDetailsRight.title)}</h3>

      <div className={cn(props.className)}>
        {parse(additionalDetailsRight.html)}
      </div>
    </div>
  )
}
