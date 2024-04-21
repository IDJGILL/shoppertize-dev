import Image from "next/image"
import Link from "next/link"
import { accountNavigations } from "~/lib/utils/constants/navigations"
import logo from "~/assets/brand/logo.svg"
import PaymentBadges from "../payment-badges"
import ShippingBadges from "../shipping-badges"
import SSL from "~/assets/badges/trust/ssl-secure.png"
import SafeCheckout from "~/assets/badges/trust/safe-checkout.png"
import { IterationCw, Package2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <section className=" container py-8">
        <div>
          <div className="mb-4 max-w-max">
            <Link href="/">
              <Image
                src={logo as unknown as string}
                alt="Shoppertize"
                className="w-32 pb-[7px] md:w-[180px]"
              />
            </Link>
          </div>

          <div>
            <p className="mb-2 max-w-sm text-sm">
              Elevate your shopping experience with Shoppertize – where
              imagination meets innovation. Discover joy in every category, from
              playful kids treasures to cutting-edge IT essentials!
            </p>

            <div className="flex items-center gap-2">
              <span className="w-6 border-b border-muted-foreground" />{" "}
              <span className="text-xs italic">Shop kar befikar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container flex flex-col gap-12 border-t py-10 md:flex-row md:gap-8">
        <div className="flex-1">
          <div className="flex flex-col items-start gap-6 md:flex-row md:gap-20">
            {/* <LinkBlock
              title="CATEGORIES"
              links={[
                {
                  title: "Stationary",
                  href: storeNavigations.dynamic.shop.path("stationary"),
                },
                {
                  title: "Home & Kitchen",
                  href: storeNavigations.dynamic.shop.path("home-kitchen"),
                },
                {
                  title: "Accessories",
                  href: storeNavigations.dynamic.shop.path("accessories"),
                },
                {
                  title: "Personal care",
                  href: storeNavigations.dynamic.shop.path("personal-care"),
                },
              ]}
            /> */}

            <LinkBlock
              title="COMPANY"
              links={[
                {
                  title: "Privacy Policy",
                  href: "/policy/privacy",
                },
                {
                  title: "Terms and Conditions",
                  href: "/policy/terms",
                },
                {
                  title: "Shipping",
                  href: "/policy/shipping",
                },
                {
                  title: "Returns, refund and exchange",
                  href: "/policy/returns-and-exchange",
                },
              ]}
            />

            <LinkBlock
              title="Account"
              links={[
                {
                  title: "My Profile",
                  href: accountNavigations.static.account.path,
                },
                {
                  title: "My Orders",
                  href: accountNavigations.static.orders.path,
                },
                {
                  title: "Wishlist",
                  href: accountNavigations.static.wishlist.path,
                },
              ]}
            />
          </div>
        </div>

        <div className="md:w-[30%] md:self-end">
          <div className="mb-8">
            <ul className="mr-auto flex w-max flex-col items-start justify-start gap-2 text-left text-sm font-semibold text-green-700 md:ml-auto md:mr-0 md:items-end md:text-right">
              <li className="flex flex-row-reverse items-center gap-2 md:flex-row">
                Cash on Delivery <Package2 className="h-4 w-4" />
              </li>
              <li className="flex flex-row-reverse items-center gap-2 md:flex-row">
                7 Days Return Policy <IterationCw className="h-4 w-4" />
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4 md:justify-end">
            <Image
              src={SSL}
              alt="SSL Secure"
              sizes="100vw"
              className="h-auto w-full max-w-[180px]"
            />
            <Image
              src={SafeCheckout}
              alt="Safe Checkout"
              sizes="100vw"
              className="h-auto w-full max-w-[180px]"
            />
          </div>
        </div>
      </section>

      <section className="border-y py-8">
        <div className="container flex flex-col items-center justify-between md:flex-row md:gap-4">
          <div className="w-full flex-1">
            <div className="flex w-full flex-col items-center gap-4 md:flex-row">
              <div className="whitespace-nowrap text-sm text-muted-foreground">
                <span className="md:hidden">
                  Our Payment & Shipping Partners:
                </span>
                <span className="hidden md:block">Payment Partners:</span>
              </div>
              <PaymentBadges />
            </div>
          </div>

          <div className="hidden h-8 border-r md:block" />

          <div className="w-full flex-1">
            <div className="flex w-full flex-col items-center gap-4 md:flex-row">
              <div className="hidden whitespace-nowrap text-sm text-muted-foreground md:block">
                Shipping Partners:
              </div>
              <ShippingBadges />
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <p className="container text-center text-sm text-muted-foreground">
          © 2021 Shoppertize. All Rights Reserved.
        </p>
      </section>
    </footer>
  )
}

interface LinkBlockProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  links: {
    title: string
    href: string
  }[]
}

function LinkBlock({ ...props }: LinkBlockProps) {
  return (
    <div>
      <h4 className="mb-3 text-sm  uppercase">{props.title}</h4>

      <ul className="flex flex-wrap items-center md:flex-col md:items-start">
        {props.links.map((link, index) => (
          <li key={link.title} className="mb-2 text-sm hover:underline">
            <Link href={link.href}>{link.title}</Link>{" "}
            {index !== props.links.length - 1 && (
              <span className="mx-3 h-[6px] border-r border-foreground md:hidden"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
