"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingScreen } from "@/components/loading-screen"
import { toast } from "sonner"
import { X, Upload } from "lucide-react"

export function CreateRoomForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        // Adjuntar imágenes manualmente al FormData si es necesario
        images.forEach(img => formData.append('images', img))

        try {
            const res = await fetch("/api/room", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Error al crear habitación")
            }

            toast.success("Habitación creada exitosamente")
            router.push("/admin/habitaciones")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 4) {
            toast.error("Máximo 4 imágenes")
            return
        }

        setImages(prev => [...prev, ...files])

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setPreviews(prev => [...prev, ...newPreviews])
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    if (loading) return <LoadingScreen text="Creando habitación..." />

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" required placeholder="Ej. Suite Presidencial" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL amigable)</Label>
                            <Input id="slug" name="slug" required placeholder="ej-suite-presidencial" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Precio por noche ($)</Label>
                            <Input id="price" name="price" type="number" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="holder">Nombre del Anfitrión</Label>
                            <Input id="holder" name="holder" defaultValue="Hotel Acuario" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amenities">Comodidades (separadas por coma)</Label>
                        <Input id="amenities" name="amenities" placeholder="Wifi, TV, Aire Acondicionado..." />
                    </div>

                    <div className="space-y-4">
                        <Label>Imágenes (Máx 4)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {previews.map((src, i) => (
                                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 4 && (
                                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer bg-muted/5 transition">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Subir imagen</span>
                                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Crear Habitación
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
