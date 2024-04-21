export type CustomerReviewApiData = {
  product: {
    reviews: {
      nodes: [
        {
          status: "APPROVE" | "HOLD" | "SPAM" | "TRASH"
          content: string
        },
      ]
    }
  }
}
