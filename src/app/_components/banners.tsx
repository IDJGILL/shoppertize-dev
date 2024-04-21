"use client"

import Banner1 from "~/assets/banners/Banner-1.png"
import Banner2 from "~/assets/banners/Banner-2.png"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface BannersProps extends React.HTMLAttributes<HTMLElement> {}

export default function Banners({ ...props }: BannersProps) {
  const {} = props

  return (
    <div>
      <Carousel className="w-full" plugins={[Autoplay()]} opts={{ loop: true }}>
        <CarouselContent>
          <CarouselItem>
            <Link href="/shop/stationery">
              <Image src={Banner1} alt="" />
            </Link>
          </CarouselItem>

          <CarouselItem>
            <Link href="/shop/computers-and-accessories">
              <Image src={Banner2} alt="" />
            </Link>
          </CarouselItem>
        </CarouselContent>

        {/* <CarouselPrevious />
      <CarouselNext /> */}
      </Carousel>
    </div>
  )
}
