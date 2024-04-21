"use client"

import "swiper/css"
import "swiper/css/zoom"
import type { Swiper as SwiperInstance } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { Zoom, Controller } from "swiper/modules"
import Image from "next/image"
import { cn } from "~/lib/utils/functions/ui"

interface ImageSliderProps extends React.HTMLAttributes<HTMLElement> {
  images: string[]
  options: {
    type: "static" | "dynamic"
  } & (StaticImageGallery | DynamicImageGallery)
}

type StaticImageGallery = {
  type: "static"
  currentIndex: number
  onClick: (activeIndex: number) => void
}

type DynamicImageGallery = {
  type: "dynamic"
  currentIndex?: number
  zoom: boolean
  onClick?: (activeIndex: number) => void
  onSlideChange?: (instance: SwiperInstance) => void
  controller?: SwiperInstance | null
}

export default function ImageSlider({ ...props }: ImageSliderProps) {
  const { options, images } = props

  if (options.type === "static") {
    return (
      <div className="flex h-full items-center justify-center">
        {images.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={500}
            height={500}
            priority
            className={cn("hidden cursor-pointer", {
              block: options.currentIndex === index,
            })}
            onClick={() => options.onClick(options.currentIndex)}
          />
        ))}
      </div>
    )
  }

  if (options.type === "dynamic") {
    return (
      <div>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          onActiveIndexChange={(s) =>
            options.onSlideChange ? options.onSlideChange(s) : null
          }
          modules={[Zoom, Controller]}
          zoom={options.zoom}
          controller={{ control: options.controller }}
          onSwiper={(instance) =>
            options.onSlideChange ? options.onSlideChange(instance) : null
          }
        >
          {images.map((src, index) => (
            <SwiperSlide
              className={cn("relative ", {
                "aspect-square": !options.zoom,
              })}
              key={src + index}
              style={{
                height: options.zoom ? "calc(100dvh - 57px - 90px)" : "",
              }}
            >
              <div
                className={cn("relative h-full", {
                  "swiper-zoom-container h-full": options.zoom,
                })}
              >
                <Image
                  src={src}
                  fill
                  className="h-auto w-full object-contain object-center"
                  onClick={() =>
                    options.onClick ? options.onClick(index) : null
                  }
                  alt=""
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
}
