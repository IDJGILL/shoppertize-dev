import { UserIcon } from "lucide-react"
import Rating from "~/app/_components/ui/rating"
import { getReviews } from "../utils/review-apis"
import { type Review } from "../utils/review-gql"

interface ReviewsListProps extends React.HTMLAttributes<HTMLElement> {
  slug: string
}

export default async function ReviewsList({ ...props }: ReviewsListProps) {
  const reviews = await getReviews({
    limit: 10,
    slug: props.slug,
  })

  return (
    <div>
      <div>
        {reviews.data.map((item) => (
          <ReviewCard key={item.node.databaseId} review={item} />
        ))}
      </div>
    </div>
  )
}

interface ReviewCardProps extends React.HTMLAttributes<HTMLElement> {
  review: Review
}

function ReviewCard({ ...props }: ReviewCardProps) {
  const { review } = props

  return (
    <div className="rounded border bg-white p-4 shadow">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
          <UserIcon className="text-zinc-400" />
        </div>

        <div>
          <h4 className="text-sm font-medium">
            {review.node.author.node.name}
          </h4>
          <div className="">
            <Rating type="static" default={review.rating} className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="mb-2 text-sm">{review.node.content}</div>
      <div className="text-xs text-muted-foreground">
        Reviewed in India on{" "}
        {new Date(review.node.date).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  )
}
