import { redirect } from "next/navigation"
import { type Metadata } from "next/types"
import metaFinder from "~/lib/utils/functions/meta-finder"
import AddToHistory from "../_components/shared/add-to-history"
import ImageGallery from "../_components/shared/image-gallery"
import Divider from "../_components/shared/section-divider"
import ProductPrice from "../_components/shared/product-price"
import ShoppersChoice from "../_components/shared/shoppers-choice-badge"
import ProductRating from "../_components/shared/product-rating"
import ProductBulletPoints from "../_components/shared/product-bulletpoints"
import { getProductBySlug, getProductSlugs } from "~/lib/modules/product/utils/product-apis"
import { AddToCart } from "~/vertex/components/cart/AddToCart/adtc"
import Skeleton from "react-loading-skeleton"
import AddToCartButton from "../_components/add-to-cart-button"

export const dynamic = "error"

export default async function ProductPage(props: ServerComponentParams) {
  const slug = props.params.slug

  if (!slug) return redirect("/404")

  const product = await getProductBySlug(slug)

  if (!product) return redirect("/404")

  const extraData = getProductExtraData(product.metaData)

  return (
    <main className="container px-0 md:px-8 md:py-10">
      <AddToHistory product={product} />

      <section className="grid grid-cols-1 md:mb-20 md:grid-cols-2 md:space-x-10">
        <ImageGallery product={product} />

        <div className="py-4 md:px-0 md:py-0">
          <div>
            <div className="px-4 md:px-0">
              <h1 className="mb-4 scroll-m-20 text-base md:text-xl">{product.name}</h1>

              <ProductRating product={product} className="mb-5" />

              <ShoppersChoice product={product} />
            </div>

            <Divider />

            <div className="px-4 md:px-0">
              <ProductPrice product={product} />
            </div>

            <Divider />

            <div className="sticky bottom-0 bg-white px-4 py-2 md:px-0">
              <AddToCart
                productId={product.id as string}
                error={<div>Something went wrong</div>}
                loader={
                  <div className="flex-1">
                    <Skeleton className="min-h-[44px] w-full" />
                  </div>
                }
              >
                <AddToCartButton />
              </AddToCart>
            </div>

            <Divider />

            <div className="px-4 md:px-0">
              <ProductBulletPoints extraData={extraData} />
            </div>

            {/* <ProductReviews product={product} slug={slug} /> */}
          </div>
        </div>
      </section>

      {/* <RelatedProducts product={product} slug={slug} />

      <ProductDescription extraData={extraData} />

      <APlusContent extraData={extraData} />

      <ProductAdditionDetails extraData={extraData} />

      <BrowsedProducts excludeItemIds={[slug]} /> */}
    </main>
  )
}

export async function generateMetadata({ params }: ServerComponentParams): Promise<Metadata> {
  const product = await getProductBySlug(params.slug ?? "")

  if (!product) throw new Error("Something went wrong")

  return {
    title: product.name,
    description: "",
    openGraph: {
      images: [
        {
          url: product.image.sourceUrl,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()

  return slugs
}

export type ProductExtraData = {
  bulletPoint: {
    title: string | null
    html: string | null
  }
  description: {
    title: string | null
    html: string | null
  }
  additionalDetailsLeft: {
    title: string | null
    html: string | null
  }
  additionalDetailsRight: {
    title: string | null
    html: string | null
  }
  aPlusContent: {
    title: string | null
    html: string | null
  }
}

const getProductExtraData = (metaData: MetaData[]): ProductExtraData => {
  return {
    bulletPoint: {
      title: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "bullet_points_title",
      }),
      html: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "bullet_points",
      }),
    },
    description: {
      title: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "description_title",
      }),
      html: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "description",
      }),
    },
    additionalDetailsLeft: {
      title: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "additional_details_left_title",
      }),
      html: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "additional_details_left",
      }),
    },
    additionalDetailsRight: {
      title: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "additional_details_right_title",
      }),
      html: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "additional_details_right",
      }),
    },
    aPlusContent: {
      title: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "a_plus_content_title",
      }),
      html: metaFinder.safeParse<string>({
        metaData: metaData,
        key: "a_plus_content",
      }),
    },
  }
}
