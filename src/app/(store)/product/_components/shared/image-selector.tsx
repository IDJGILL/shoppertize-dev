"use client"

import "swiper/css"
import Image from "next/image"
import type { Swiper as SwiperInstance } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { cn } from "~/lib/utils/functions/ui"
import { Controller } from "swiper/modules"

interface ImageSelectorProps extends React.HTMLAttributes<HTMLElement> {
  images: string[]
  options: {
    type: "static" | "dynamic"
  } & (
    | {
        type: "static"
        orientation: "horizontal" | "vertical"
        onClick?: (activeIndex: number) => void
        onHover?: (activeIndex: number) => void
        activeIndex: number
      }
    | ({
        type: "dynamic"
        orientation: "horizontal" | "vertical"
        controller?: SwiperInstance | null
        onClick?: (activeIndex: number) => void
        onSliderChange?: (instance: SwiperInstance) => void
        onHover?: (activeIndex: number) => void
      } & (
        | { orientation: "vertical"; height: number }
        | { orientation: "horizontal" }
      ))
  )
}

export default function ImageSelector({ ...props }: ImageSelectorProps) {
  const { images, options } = props

  if (options.type === "static") {
    return (
      <div className={cn("space-y-4", props.className)}>
        {images.map((src, index) => (
          <div
            key={src + index}
            className={cn(
              "flex aspect-square max-w-max cursor-pointer items-center justify-center overflow-hidden rounded",
              {
                "outline outline-1 outline-offset-2 outline-secondary":
                  options.activeIndex === index,
              },
            )}
            onMouseOver={() => {
              if (options.onHover) {
                options.onHover(index)
              }
            }}
            onClick={() => {
              if (options.onClick) {
                options.onClick(index)
              }
            }}
          >
            <Image src={src} width={90} height={90} alt="" />
          </div>
        ))}
      </div>
    )
  }

  if (options.type === "dynamic") {
    return (
      <div>
        <Swiper
          direction={options.orientation}
          spaceBetween={4}
          slidesPerView={4}
          modules={[Controller]}
          onSwiper={(instance) => {
            if (options.onSliderChange) {
              options.onSliderChange(instance)
            }
          }}
          navigation={true}
          style={{
            height:
              options.orientation === "vertical" ? options.height : "100%",
          }}
        >
          {images.map((src, index) => (
            <SwiperSlide
              className="relative aspect-square"
              key={src + index}
              onClick={() => {
                if (options.controller) {
                  options.controller.slideTo(index)
                }

                if (options.onClick) {
                  options.onClick(index)
                }
              }}
              onMouseOver={() => {
                if (options.onHover) {
                  options.onHover(index)
                }
              }}
            >
              <div>
                <Image src={src} width={90} height={90} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }
}
