"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Star, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

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
            toast.success("¡Reseña publicada!")
        } catch (error) {
            toast.error("No se pudo publicar la reseña")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Reseñas ({reviews.length})</h2>

            <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-xl bg-muted/20">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="hover:scale-110 transition"
                        >
                            <Star
                                className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>

                {!user && (
                    <Input
                        placeholder="Tu Nombre (Opcional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="max-w-sm bg-background"
                    />
                )}

                <Textarea
                    placeholder="Comparte tu experiencia..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="min-h-[100px] bg-background"
                />
                <Button type="submit" disabled={loading || !comment.trim()}>
                    {loading ? "Publicando..." : "Publicar Reseña"}
                </Button>
            </form>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold">{review.userName}</p>
                                    <div className="flex gap-1">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm mb-2">
                                    {new Date(review.createdAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-foreground">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
