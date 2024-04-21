import {
  ReviewsGql,
  AddReviewGql,
  OrderMetaGql,
  AddFeedbackGql,
  AddBulkReviewsGql,
  type AddReviewGqlData,
  type AddReviewGqlInput,
  type OrderMetaGqlData,
  type OrderMetaGqlInput,
  type ReviewsGqlData,
  type ReviewsGqlInput,
  type AddFeedbackGqlData,
  type AddFeedbackGqlInput,
  type AddBulkReviewsGqlData,
  type AddBulkReviewsGqlInput,
} from "./review-gql"
import {
  BulkReviewsSchema,
  AddReviewSchema,
  ShoppingFeedbackSchema,
  type ShoppingFeedbackSchemaProps,
  type AddReviewSchemaProps,
  type BulkReviewsSchemaProps,
  type InfiniteReviewsSchemaProps,
} from "./review-schemas"
import { type AuthedTrpcContext } from "~/lib/trpc/trpc-context"
import moment from "moment"
import metaFinder from "~/lib/utils/functions/meta-finder"
import { nanoid } from "nanoid"
import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc-instance"
import { client } from "~/lib/graphql/client"
import { createAction } from "~/lib/utils/functions/create-action"

export const addOrderReview = async (props: AuthedTrpcContext<AddReviewSchemaProps>) => {
  return await createAction(async (response) => {
    const { order } = await client<OrderMetaGqlData, OrderMetaGqlInput>({
      access: "user",
      query: OrderMetaGql,
      inputs: {
        id: props.session.authToken,
      },
      authToken: props.session.authToken,
    })

    if (order.status !== "DELIVERED") {
      throw new ExtendedError({
        action: "none",
        message: "You are not allowed to post review.",
      })
    }

    const isReviewed = !!order.lineItems.nodes.find((a) =>
      metaFinder.safeParse({
        key: `review:${a.productId}`,
        metaData: order.metaData,
      }),
    )

    if (isReviewed) {
      throw new ExtendedError({
        action: "none",
        message: "This product has already been reviewed by you.",
      })
    }

    await client<AddReviewGqlData, AddReviewGqlInput>({
      access: "admin",
      query: AddReviewGql,
      inputs: {
        orderId: props.input.orderId,
        rating: props.input.rating,
        commentOn: props.input.productId,
        content: props.input.comment,
        authorEmail: props.session.user.email,
        metaData: [
          {
            key: `review:${props.input.productId}`,
            value: Date.now().toString(),
          },
        ],
      },
    })

    return response.success({
      data: null,
      action: "success",
      message: "Review submitted successfully.",
    })
  })
}

export const addFeedback = async (props: AuthedTrpcContext<ShoppingFeedbackSchemaProps>) => {
  return await createAction(async (response) => {
    await client<AddFeedbackGqlData, AddFeedbackGqlInput>({
      access: "admin",
      query: AddFeedbackGql,
      inputs: {
        title: `From: ${props.session.user.name} - ${moment().format("MMMM Do YYYY")}`,
        content: `Rating: ${props.input.rating}/5
        Feedback: ${props.input.comment ? props.input.comment : "NA"}
        `,
      },
    })

    return response.success({
      action: "none",
      data: null,
      message: "Feedback added",
    })
  })
}

export const addBulkReviews = async (props: BulkReviewsSchemaProps) => {
  return await createAction(async (response) => {
    const data = await BulkReviewsSchema.parseAsync(props)

    if (data.superSecretKey !== process.env.SUPER_SECRET_KEY) {
      throw new ExtendedError({
        action: "none",
        message: "Nah dude, Your super secret key is invalid 😢.",
      })
    }

    const requests = data.reviews.map((a) =>
      client<AddBulkReviewsGqlData, AddBulkReviewsGqlInput>({
        access: "admin",
        query: AddBulkReviewsGql,
        inputs: {
          rating: a.rating,
          commentOn: data.productId,
          authorEmail: nanoid() + "@gmail.com",
          content: a.comment,
          author: a.name,
        },
      }),
    )

    await Promise.all(requests)

    return response.success({
      data: null,
      action: "none",
      message: "Yeah dude, You did it 🎉.",
    })
  })
}

export const getReviews = async (input: InfiniteReviewsSchemaProps) => {
  const data = await client<ReviewsGqlData, ReviewsGqlInput>({
    access: "public",
    query: ReviewsGql,
    cacheTags: [],
    inputs: { id: input.slug, after: input.cursor ?? "" },
  })

  const reviews = data.product.reviews.edges

  const reviewUtils = data.product.reviews

  let nextCursor: string | undefined = undefined

  if (reviewUtils.pageInfo.hasNextPage) {
    const lastItem = reviews[reviews.length - 1]

    nextCursor = lastItem ? lastItem.cursor : undefined
  } else {
    nextCursor = undefined
  }

  return {
    nextCursor,
    data: reviews,
    hasNextPage: reviewUtils.pageInfo.hasNextPage,
    hasPreviousPage: reviewUtils.pageInfo.hasPreviousPage,
  }
}

export const reviewRouter = createTRPCRouter({
  addOrderReview: protectedProcedure.input(AddReviewSchema).mutation(async ({ ctx, input }) => {
    return await addOrderReview({ ...ctx, input })
  }),

  addFeedback: protectedProcedure.input(ShoppingFeedbackSchema).mutation(async ({ ctx, input }) => {
    return await addFeedback({ ...ctx, input })
  }),
})
