"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface RoomGalleryProps {
    images: string[]
    title: string
}

export function RoomGallery({ images, title }: RoomGalleryProps) {
    const [index, setIndex] = useState<number | null>(null)

    const openLightbox = (i: number) => setIndex(i)
    const closeLightbox = () => setIndex(null)

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (index === null) return
        setIndex((prev) => (prev! + 1) % images.length)
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (index === null) return
        setIndex((prev) => (prev! - 1 + images.length) % images.length)
    }

    return (
        <>
            {/* GRID DE IMÁGENES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
                {/* IMAGEN PRINCIPAL */}
                <div
                    className="relative h-full cursor-pointer group overflow-hidden"
                    onClick={() => openLightbox(0)}
                >
                    <Image
                        src={images[0]}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* IMÁGENES SECUNDARIAS */}
                <div className="grid grid-cols-2 gap-2 h-full">
                    {images.slice(1, 5).map((image, i) => (
                        <div
                            key={i}
                            className="relative h-full cursor-pointer group overflow-hidden"
                            onClick={() => openLightbox(i + 1)}
                        >
                            <Image
                                src={image}
                                alt={`${title} - Foto ${i + 2}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                    ))}

                    {/* Si hay menos de 2 imágenes (solo la principal), rellenamos visualmente */}
                    {images.length === 1 && (
                        <>
                            <div className="bg-muted relative flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">Sin más fotos</span>
                            </div>
                            <div className="bg-muted relative flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">...</span>
                            </div>
                            <div className="bg-muted relative flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">...</span>
                            </div>
                            <div className="bg-muted relative flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">...</span>
                            </div>
                        </>
                    )}

                    {/* BOTÓN VER TODAS (Si hay más de 5) -- Opcional, por ahora solo grid fija */}
                </div>
            </div>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {index !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* CONTROLES */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        {/* IMAGEN CENTRAL */}
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en la imagen
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={images[index]}
                                    alt={`Vista completa ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* INDICADOR DE POSICIÓN */}
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-sm">
                            {index + 1} / {images.length}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
