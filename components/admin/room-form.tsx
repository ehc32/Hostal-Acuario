"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { IconX, IconUpload, IconLoader, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import Image from "next/image"

const roomSchema = z.object({
    title: z.string().min(3, "El título es requerido"),
    description: z.string().min(10, "La descripción es muy corta"),
    price: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
    holder: z.string().optional(),
    images: z.array(z.string()),
    amenities: z.array(z.string()),
})

// Exportamos el tipo para uso externo si fuera necesario
export type RoomFormValues = z.infer<typeof roomSchema>

interface RoomFormProps {
    initialData?: any
    onSubmit: (data: RoomFormValues) => Promise<void>
    isLoading?: boolean
}

export function RoomForm({ initialData, onSubmit, isLoading }: RoomFormProps) {
    const [uploading, setUploading] = React.useState(false)
    const [newFiles, setNewFiles] = React.useState<{ id: string, file: File, preview: string }[]>([])
    const [amenityInput, setAmenityInput] = React.useState("")

    // Preparar defaultValues con cuidado de tipos
    const defaultValues: Partial<RoomFormValues> = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price ? Number(initialData.price) : 0,
        holder: initialData?.holder || "Admin",
        images: initialData?.images || [],
        amenities: [],
    }

    // Ajuste seguro de amenities
    if (initialData?.amenities) {
        if (Array.isArray(initialData.amenities)) {
            defaultValues.amenities = initialData.amenities;
        } else if (typeof initialData.amenities === 'string') {
            defaultValues.amenities = initialData.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
    }

    const form = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema) as any,
        defaultValues,
        mode: "onChange"
    })

    const existingImages = form.watch("images") || []
    const totalImages = existingImages.length + newFiles.length

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        const remainingSlots = 4 - totalImages
        if (remainingSlots <= 0) {
            toast.error("Ya has alcanzado el límite de 4 imágenes")
            e.target.value = ''
            return
        }

        let files = Array.from(e.target.files)

        if (files.length > remainingSlots) {
            toast.warning(`Solo se añadieron ${remainingSlots} imágenes para respetar el límite de 4.`)
            files = files.slice(0, remainingSlots)
        }

        const newAttachments = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file)
        }))

        setNewFiles(prev => [...prev, ...newAttachments])
        e.target.value = ''
    }

    const removeNewFile = (id: string) => {
        setNewFiles(prev => prev.filter(f => f.id !== id))
    }

    const removeExistingImage = (url: string) => {
        const current = form.getValues("images")
        form.setValue("images", current.filter(img => img !== url))
    }

    const uploadFiles = async (): Promise<string[]> => {
        if (newFiles.length === 0) return []

        const uploadPromises = newFiles.map(async ({ file }) => {
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: 'POST',
                body: file,
            })
            if (!res.ok) throw new Error(`Fallo al subir ${file.name}`)
            const blob = await res.json()
            return blob.url
        })

        return Promise.all(uploadPromises)
    }

    const handleAmenityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addAmenity()
        }
    }

    const addAmenity = () => {
        const val = amenityInput.trim()
        if (!val) return

        const current = form.getValues("amenities") || []
        if (!current.includes(val)) {
            form.setValue("amenities", [...current, val])
        }
        setAmenityInput("")
    }

    const removeAmenity = (amenity: string) => {
        const current = form.getValues("amenities") || []
        form.setValue("amenities", current.filter(a => a !== amenity))
    }

    const handleFormSubmit = async (data: RoomFormValues) => {
        const finalCount = data.images.length + newFiles.length

        if (finalCount === 0) {
            form.setError("images", { message: "Debes subir al menos una imagen" })
            return
        }

        if (finalCount > 4) {
            toast.error("Has excedido el máximo de 4 imágenes")
            return
        }

        try {
            setUploading(true)

            let newUrls: string[] = []
            if (newFiles.length > 0) {
                toast.info("Subiendo imágenes...")
                newUrls = await uploadFiles()
            }

            const finalImages = [...data.images, ...newUrls]

            await onSubmit({
                ...data, // TypeScript ya debería estar feliz
                images: finalImages
            })

        } catch (error) {
            console.error(error)
            toast.error("Hubo un error al subir las imágenes")
        } finally {
            setUploading(false)
        }
    }

    const currentAmenities = form.watch("amenities")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Suite Presidencial" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio por noche (COP)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe la habitación detalladamente..."
                                    className="min-h-[200px] text-base leading-relaxed resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="holder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Anfitrión</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del anfitrión" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Comodidades</FormLabel>
                        <FormControl>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Escribe y presiona Enter..."
                                        value={amenityInput}
                                        onChange={e => setAmenityInput(e.target.value)}
                                        onKeyDown={handleAmenityKeyDown}
                                    />
                                    <Button type="button" variant="secondary" onClick={addAmenity}>
                                        <IconPlus className="size-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-muted/20">
                                    {currentAmenities?.length > 0 ? currentAmenities.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => removeAmenity(tag)} className="hover:text-destructive">
                                                <IconX className="size-3" />
                                            </button>
                                        </Badge>
                                    )) : (
                                        <span className="text-sm text-muted-foreground self-center px-1">Sin comodidades añadidas</span>
                                    )}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>

                <div className="space-y-3">
                    <FormLabel>Fotografías ({totalImages}/4)</FormLabel>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">

                        {existingImages.map((url, index) => (
                            <div key={`existing-${index}`} className="relative aspect-square overflow-hidden rounded-lg border bg-muted group">
                                <Image src={url} alt="Room" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeExistingImage(url)}>
                                        <IconX className="size-4" />
                                    </Button>
                                </div>
                                <Badge className="absolute top-1 left-1 h-5 px-1.5 text-[10px]" variant="secondary">Guardada</Badge>
                            </div>
                        ))}

                        {newFiles.map((item) => (
                            <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg border bg-muted group ring-2 ring-primary/20">
                                <Image src={item.preview} alt="New Preview" fill className="object-cover opacity-90" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeNewFile(item.id)}>
                                        <IconX className="size-4" />
                                    </Button>
                                </div>
                                <Badge className="absolute top-1 left-1 h-5 px-1.5 text-[10px] bg-blue-500 text-white hover:bg-blue-600">Nueva</Badge>
                            </div>
                        ))}

                        {totalImages < 4 && (
                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed hover:bg-muted/50 transition-colors bg-card">
                                <IconUpload className="text-muted-foreground size-8 mb-2" />
                                <span className="text-xs text-muted-foreground font-medium">Agregar Fotos</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                            </label>
                        )}
                    </div>
                    {totalImages >= 4 && (
                        <p className="text-xs text-amber-500 font-medium pt-2">Límite de 4 imágenes alcanzado.</p>
                    )}
                    <FormMessage>
                        {form.formState.errors.images?.message}
                    </FormMessage>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading || uploading} size="lg" className="w-full md:w-auto">
                        {uploading ? "Subiendo imágenes..." : (isLoading ? "Guardando..." : (initialData?.title ? "Guardar Cambios" : "Crear Habitación"))}
                        {(isLoading || uploading) && <IconLoader className="ml-2 animate-spin size-4" />}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
