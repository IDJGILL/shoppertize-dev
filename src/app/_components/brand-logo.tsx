"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "~/assets/brand/logo.svg"

export default function BrandLogo({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {} = props

  const path = usePathname()

  return (
    <>
      {path === "/" ? (
        <div className="max-w-max pr-2 md:hidden">
          <Link href="/">
            <Image
              src={Logo as unknown as string}
              alt="Shoppertize"
              className="w-32 px-1 pb-[7px] pt-1 md:w-[180px]"
              priority
            />
          </Link>
        </div>
      ) : null}

      <div className="hidden max-w-max pr-2 md:block">
        <Link href="/">
          <Image
            src={Logo as unknown as string}
            alt="Shoppertize"
            className="w-32 px-1 pb-[7px] pt-1 md:w-[180px]"
            priority
          />
        </Link>
      </div>
    </>
  )
}
