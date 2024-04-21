import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   analytics: true,
//   limiter: Ratelimit.slidingWindow(2, "5s"),
// })

export const productRouter = createTRPCRouter({
  // getSimpleProductStock: publicProcedure
  //   .input(GetProductStockDTO)
  //   .query(async ({ input }) => {
  //     return await getSimpleProductStock(input.productId, input.tag)
  //   }),

  // getInfiniteReviewsByProductSlug: publicProcedure
  //   .input(InfiniteReviewsDTO)
  //   .query(async ({ input }) => {
  //     return await getInfiniteReviewsByProductSlug(input)
  //   }),

  // getProductSearchData: publicProcedure.mutation(async () => {
  //   return await getProductSearchData()
  // }),

  // getProductCategories: publicProcedure.query(async () => {
  //   return await getProductCategories()
  // }),

  // notRateLimited: publicProcedure.mutation(async () => {
  //   return await getProductCategories()
  // }),

  rateLimited: publicProcedure.query(async () => {
    // const id = ctx.request.ip ?? "anonymous"
    // const headers = ctx.resHeaders
    // const limit = await ratelimit.limit(id ?? "anonymous")
    // headers.set("X-RateLimit-Limit", limit.limit.toString())
    // headers.set("X-RateLimit-Remaining", limit.remaining.toString())
    // headers.set("X-RateLimit-Reset", limit.reset.toString())
    // if (!limit.success) {
    //   throw new TRPCError({
    //     code: "TOO_MANY_REQUESTS",
    //     message: "You are being rate limited",
    //   })
    // }
    // return await getProductCategories()
  }),

  /* 
    
  Space -_-
    
  */

  // carousel: publicProcedure
  //   .input(ApiCarouselSchema)
  //   .query(async ({ input }) => {
  //     return await getCarouselProducts(input)
  //   }),
})
