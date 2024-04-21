import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc-instance"
import { CollectionProductsSchema } from "./shop-schemas"
import { getCollectionProducts } from "./shop-apis"

export const shopRouter = createTRPCRouter({
  collection: publicProcedure
    .input(CollectionProductsSchema)
    .query(async ({ input }) => {
      return await getCollectionProducts(input)
    }),
})
