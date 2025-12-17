"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Star, User, MessageSquarePlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Review {
    id: number
    rating: number
    comment: string
    userName: string
    createdAt: Date
}

interface ReviewsSectionProps {
    roomId: number
    initialReviews: Review[]
}

export function ReviewsSection({ roomId, initialReviews }: ReviewsSectionProps) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>(initialReviews || [])
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    // Derived stats
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true)
        try {
            const finalName = user?.name || name || "Anónimo"

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    rating,
                    comment,
                    userName: finalName,
                    userId: user?.id || null
                })
            })

            if (!res.ok) throw new Error("Error al crear reseña")

            const newReview = await res.json()
            setReviews([newReview, ...reviews])
            setComment("")
            setRating(5)
            setName("")
            setShowForm(false)
            toast.success("¡Reseña publicada con éxito!")
        } catch (error) {
            toast.error("No se pudo publicar la reseña")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Header with Summary and Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-slate-900">{averageRating}</div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={cn("w-5 h-5", star <= Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200")} />
                            ))}
                        </div>
                        <p className="text-slate-500 font-medium mt-1">{reviews.length} reseñas verificadas</p>
                    </div>
                </div>

                <Button
                    onClick={() => setShowForm(!showForm)}
                    variant={showForm ? "secondary" : "default"}
                    className="rounded-full"
                >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    {showForm ? "Cancelar reseña" : "Escribir una reseña"}
                </Button>
            </div>

            {/* Formulario Collapsible */}
            {showForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Tu calificación</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!user && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Nombre</label>
                                <Input
                                    placeholder="Tu nombre (Opcional)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="max-w-md bg-white border-slate-200"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Comentario</label>
                            <Textarea
                                placeholder="Cuéntanos sobre tu estancia (limpieza, ubicación, servicios...)"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                className="min-h-[120px] bg-white border-slate-200 resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={loading || !comment.trim()} className="px-8">
                                {loading ? "Publicando..." : "Publicar opinión"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid de Reseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {reviews.map((review) => (
                    <div key={review.id} className="flex flex-col gap-4 group">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border border-slate-100">
                                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 font-bold">
                                    {review.userName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-slate-900 leading-none mb-1">{review.userName}</h4>
                                <p className="text-xs text-slate-500">
                                    {new Date(review.createdAt).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn("w-3.5 h-3.5", i < review.rating ? "fill-slate-900 text-slate-900" : "text-slate-200")}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-600 text-base leading-relaxed font-light">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <MessageSquarePlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">Aún no hay reseñas</h3>
                        <p className="text-slate-500">Sé el primero en compartir tu experiencia en este alojamiento.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
