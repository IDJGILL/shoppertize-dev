export const ReviewsGql = `
query ReviewsGql($id: ID = "", $after: String = "") {
  product(id: $id, idType: SLUG) {
    reviews(first: 10, after: $after, where: {}) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      averageRating
      edges {
        cursor
        rating
        node {
          databaseId
          date
          author {
            node {
              name
              id
            }
          }
          content(format: RAW)
        }
      }
    }
  }
}
`

export type ReviewsGqlData = {
  product: {
    reviews: {
      edges: Review[]
    } & Pick<EdgesProperties, "pageInfo">
  }
}

export type Review = Pick<GqlDataProps, "cursor" | "rating"> & {
  node: Pick<GqlDataProps, "databaseId" | "date" | "content"> & {
    author: { node: Pick<GqlDataProps, "id" | "name"> }
  }
}

export type ReviewsGqlInput = Pick<GqlInputProps, "id" | "after">

export const OrderMetaGql = `
query OrderMetaGql($id: ID = 0) {
  order(id: $id, idType: DATABASE_ID) {
    id
    status
    datePaid
    dateCompleted
    metaData {
			key
      value
    }
    lineItems {
      nodes {
        productId
        quantity
      }
    }
  }
}
`

export type OrderMetaGqlData = {
  order: Pick<GqlDataProps, "id" | "metaData"> &
    Pick<OrderProperties, "status" | "datePaid" | "dateCompleted" | "lineItems">
}

export type OrderMetaGqlInput = Pick<GqlDataProps, "id">

export const AddReviewGql = `
mutation AddReviewGql($rating: Int = 10, $authorEmail: String = "", $commentOn: Int = 10, $content: String = "", $orderId: Int = 10, $metaData: [MetaDataInput] = {key: "", value: ""}) {
  writeReview(
    input: {rating: $rating, authorEmail: $authorEmail, commentOn: $commentOn, content: $content}
  ) {
    review {
      status
    }
  }
  updateOrder(input: {metaData: $metaData, orderId: $orderId}) {
    clientMutationId
  }
}
`

export type AddReviewGqlData = {
  writeReview: {
    review: Pick<ReviewProperties, "status">
  }
  updateOrder: Pick<GqlDataProps, "clientMutationId">
}

export type AddReviewGqlInput = Pick<
  GqlInputProps,
  "rating" | "authorEmail" | "commentOn" | "content" | "orderId" | "metaData"
>

export const AddFeedbackGql = `
mutation AddFeedbackGql($title: String = "", $content: String = "") {
  createFeedback(input: {title: $title, content: $content, status: PUBLISH}) {
    feedback {
      id
      title
    }
  }
}
`
export type AddFeedbackGqlData = {
  createFeedback: {
    feedback: Pick<GqlDataProps, "id" | "title">
  }
}

export type AddFeedbackGqlInput = Pick<GqlInputProps, "title" | "content">

export const AddBulkReviewsGql = `
mutation AddBulkReviewsGql($rating: Int = 0, $commentOn: Int = 0, $content: String = "", $author: String = "", $authorEmail: String = "") {
  writeReview(
    input: {rating: $rating, commentOn: $commentOn, content: $content, author: $author, authorEmail: $authorEmail, status: APPROVE}
  ) {
    review {
      status
    }
  }
}
`

export type AddBulkReviewsGqlData = {
  writeReview: {
    review: Pick<ReviewProperties, "status">
  }
}

export type AddBulkReviewsGqlInput = Pick<
  GqlInputProps,
  "rating" | "commentOn" | "content" | "authorEmail" | "author"
>

export const GET_REVIEW_BY_CUSTOMER = `
query getCustomerReview($authorEmail: String = "", $id: ID = "") {
  product(id: $id, idType: DATABASE_ID) {
    reviews(where: {authorEmail: $authorEmail}) {
      nodes {
        status
        content(format: RAW)
      }
    }
  }
}
`
