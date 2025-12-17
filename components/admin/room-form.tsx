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
    FormDescription,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { IconX, IconUpload, IconLoader, IconPlus, IconCurrencyDollar, IconPhoto, IconFileInfo, IconHome } from "@tabler/icons-react"
import { toast } from "sonner"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const roomSchema = z.object({
    title: z.string().min(3, "El título es requerido"),
    slug: z.string().min(3, "El slug es requerido").regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
    description: z.string().min(10, "La descripción es muy corta"),
    price: z.coerce.number().min(1, "El precio debe ser mayor a 0"),
    priceHour: z.coerce.number().optional().default(0),
    climate: z.enum(["AIRE", "VENTILADOR", "NONE"]).default("NONE"),
    holder: z.string().optional(),
    images: z.array(z.string()),
    amenities: z.array(z.string()),
})

export type RoomFormValues = z.infer<typeof roomSchema>

interface RoomFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any
    onSubmit: (data: RoomFormValues) => Promise<void>
    isLoading?: boolean
}

export function RoomForm({ initialData, onSubmit, isLoading }: RoomFormProps) {
    const [uploading, setUploading] = React.useState(false)
    const [newFiles, setNewFiles] = React.useState<{ id: string, file: File, preview: string }[]>([])
    const [amenityInput, setAmenityInput] = React.useState("")

    const defaultValues: Partial<RoomFormValues> = {
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        price: initialData?.price ? Number(initialData.price) : 0,
        priceHour: initialData?.priceHour ? Number(initialData.priceHour) : 0,
        climate: initialData?.climate || "NONE",
        holder: initialData?.holder || "Admin",
        images: initialData?.images || [],
        amenities: [],
    }

    if (initialData?.amenities) {
        if (Array.isArray(initialData.amenities)) {
            defaultValues.amenities = initialData.amenities;
        } else if (typeof initialData.amenities === 'string') {
            defaultValues.amenities = initialData.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
    }

    const form = useForm<RoomFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(roomSchema) as any,
        defaultValues,
        mode: "onChange"
    })

    const existingImages = form.watch("images") || []
    const totalImages = existingImages.length + newFiles.length

    const titleValue = form.watch("title")
    React.useEffect(() => {
        if (titleValue && !initialData?.slug) {
            const generatedSlug = titleValue
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            form.setValue("slug", generatedSlug, { shouldValidate: true })
        }
    }, [titleValue, form, initialData?.slug])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        const remainingSlots = 4 - totalImages
        if (remainingSlots <= 0) {
            toast.error("Límite de 4 imágenes alcanzado")
            e.target.value = ''
            return
        }
        let files = Array.from(e.target.files)
        if (files.length > remainingSlots) {
            toast.warning(`Solo se añadieron ${remainingSlots} imágenes.`)
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
            if (!res.ok) throw new Error(`Error al subir ${file.name}`)
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
            form.setError("images", { message: "Se requiere al menos una imagen" })
            return
        }
        if (finalCount > 4) {
            toast.error("Máximo 4 imágenes permitidas")
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
            await onSubmit({ ...data, images: finalImages })
        } catch (error) {
            console.error(error)
            toast.error("Error al procesar las imágenes")
        } finally {
            setUploading(false)
        }
    }

    const currentAmenities = form.watch("amenities")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <IconFileInfo className="w-5 h-5 text-slate-500" />
                                    Información Principal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título de la habitación</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Suite Deluxe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL (Slug)</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-slate-50 font-mono text-sm" />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Identificador único para la dirección web.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe las características principales..."
                                                    className="min-h-[120px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <IconHome className="w-5 h-5 text-slate-500" />
                                    Detalles y Comodidades
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="climate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Climatización</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col gap-2 pt-2"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="AIRE" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Aire Acondicionado</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="VENTILADOR" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Ventilador</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="NONE" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Ninguno</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="holder"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Anfitrión asignado</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                <FormItem>
                                    <FormLabel>Lista de Comodidades</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Añadir comodidad (ej: Wifi, TV)..."
                                                    value={amenityInput}
                                                    onChange={e => setAmenityInput(e.target.value)}
                                                    onKeyDown={handleAmenityKeyDown}
                                                />
                                                <Button type="button" variant="outline" onClick={addAmenity}>
                                                    <IconPlus className="size-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {currentAmenities?.length > 0 ? currentAmenities.map((tag, i) => (
                                                    <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1 font-normal">
                                                        {tag}
                                                        <button type="button" onClick={() => removeAmenity(tag)} className="hover:text-destructive text-slate-500">
                                                            <IconX className="size-3" />
                                                        </button>
                                                    </Badge>
                                                )) : (
                                                    <p className="text-xs text-muted-foreground italic">No hay comodidades registradas</p>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Prices & Media */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <IconCurrencyDollar className="w-5 h-5 text-slate-500" />
                                    Precios
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio por Noche (COP)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="priceHour"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio por Rato (Opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} />
                                            </FormControl>
                                            <FormDescription>
                                                Valor para estadías cortas (3h).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <IconPhoto className="w-5 h-5 text-slate-500" />
                                    Galería
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {existingImages.map((url, index) => (
                                        <div key={`existing-${index}`} className="relative aspect-square rounded-md overflow-hidden bg-slate-100 group border">
                                            <Image src={url} alt="Room" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={() => removeExistingImage(url)}>
                                                    <IconX className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {newFiles.map((item) => (
                                        <div key={item.id} className="relative aspect-square rounded-md overflow-hidden bg-slate-100 group border ring-2 ring-primary/20">
                                            <Image src={item.preview} alt="Preview" fill className="object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={() => removeNewFile(item.id)}>
                                                    <IconX className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {totalImages < 4 && (
                                        <label className="flex aspect-square flex-col items-center justify-center rounded-md border border-dashed hover:bg-slate-50 cursor-pointer transition-colors">
                                            <IconUpload className="w-5 h-5 text-slate-400 mb-1" />
                                            <span className="text-[10px] text-slate-500 font-medium">Subir</span>
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
                                <FormMessage>
                                    {form.formState.errors.images?.message}
                                </FormMessage>
                                <p className="text-xs text-muted-foreground text-center">
                                    {totalImages}/4 imágenes seleccionadas
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading || uploading} className="min-w-[150px]">
                        {uploading ? "Subiendo..." : (isLoading ? "Guardando..." : "Guardar Habitación")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
