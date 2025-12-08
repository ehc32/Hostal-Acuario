"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  alt: string
  url: string
}

export function ImageCarousel({ images, alt, url }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full h-full group/carousel">
      <Link href={url} className="block w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Imagen ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-sm transition-all",
                  i === currentIndex ? "bg-white scale-125" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}