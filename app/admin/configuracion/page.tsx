"use client"

import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import {
    LayoutGrid,
    Settings,
    ImageIcon,
    Globe,
    Mail,
    ShieldCheck,
    Save,
    ChevronRight,
    Search,
    Database,
    Upload,
    Trash2,
    X,
    Loader2,
    Cloud,
    Server,
    MapPin,
    Phone,
    Plus
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Config Type Definition
type Config = {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    logoUrl: string;

    address: string;
    phone: string;

    heroImage: string;
    infoImage: string;
    galleryImages: string[];

    cloudinaryCloudName: string;
    cloudinaryApiKey: string;
    cloudinaryApiSecret: string;

    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
};

const DEFAULT_CONFIG: Config = {
    siteName: "",
    siteDescription: "",
    supportEmail: "",
    logoUrl: "",
    address: "",
    phone: "",
    heroImage: "",
    infoImage: "",
    galleryImages: [],
    cloudinaryCloudName: "",
    cloudinaryApiKey: "",
    cloudinaryApiSecret: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
};

export default function ConfiguracionPage() {
    const [activeSection, setActiveSection] = useState("general")
    const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // File states for uploads
    const [files, setFiles] = useState<{
        logo: File | null;
        hero: File | null;
        info: File | null;
        gallery: File[];
    }>({
        logo: null,
        hero: null,
        info: null,
        gallery: []
    });

    // Previews
    const [previews, setPreviews] = useState<{
        logo: string | null;
        hero: string | null;
        info: string | null;
        gallery: string[];
    }>({
        logo: null,
        hero: null,
        info: null,
        gallery: []
    });

    // Load initial data
    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch("/api/admin/config", { headers });
            if (res.status === 401) {
                toast.error("Sesión expirada");
                return;
            }
            if (!res.ok) throw new Error("Error cargando configuración");

            const data = await res.json();
            setConfig({
                ...DEFAULT_CONFIG,
                ...data,
                galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : []
            });
        } catch (error) {
            console.error(error);
            toast.error("No se pudo cargar la configuración");
        } finally {
            setLoading(false);
        }
    };

    // Helper: Upload file to Cloudinary via our API
    const uploadFile = async (file: File) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: file,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Error subiendo imagen");
        }

        const data = await res.json();
        return data.url;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");

            // 1. Upload Images if any
            let newLogoUrl = config.logoUrl;
            let newHeroImage = config.heroImage;
            let newInfoImage = config.infoImage;
            let newGallery = [...config.galleryImages];

            if (files.logo) newLogoUrl = await uploadFile(files.logo);
            if (files.hero) newHeroImage = await uploadFile(files.hero);
            if (files.info) newInfoImage = await uploadFile(files.info);

            if (files.gallery.length > 0) {
                const uploadedGallery = await Promise.all(files.gallery.map(uploadFile));
                newGallery = [...newGallery, ...uploadedGallery];
            }

            // 2. Prepare Payload
            const payload = {
                ...config,
                logoUrl: newLogoUrl,
                heroImage: newHeroImage,
                infoImage: newInfoImage,
                galleryImages: newGallery,
            };

            // 3. Save to API
            const res = await fetch("/api/admin/config", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error guardando cambios");

            const updated = await res.json();
            setConfig({
                ...DEFAULT_CONFIG,
                ...updated,
                galleryImages: Array.isArray(updated.galleryImages) ? updated.galleryImages : []
            });

            // Clear pending files
            setFiles({ logo: null, hero: null, info: null, gallery: [] });
            setPreviews({ logo: null, hero: null, info: null, gallery: [] });

            toast.success("Configuración guardada correctamente");

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    // Handlers for file selection
    const handleFileSelect = (key: 'logo' | 'hero' | 'info', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setFiles(prev => ({ ...prev, [key]: file }));
        setPreviews(prev => ({ ...prev, [key]: url }));
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const newFiles = Array.from(e.target.files);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));

        setFiles(prev => ({ ...prev, gallery: [...prev.gallery, ...newFiles] }));
        setPreviews(prev => ({ ...prev, gallery: [...prev.gallery, ...newPreviews] }));
    };

    const removeGalleryImage = (index: number, isNew: boolean) => {
        if (isNew) {
            setFiles(prev => {
                const copy = [...prev.gallery];
                copy.splice(index, 1);
                return { ...prev, gallery: copy };
            });
            setPreviews(prev => {
                const copy = [...prev.gallery];
                copy.splice(index, 1);
                return { ...prev, gallery: copy };
            });
        } else {
            setConfig(prev => {
                const copy = [...prev.galleryImages];
                copy.splice(index, 1);
                return { ...prev, galleryImages: copy };
            });
        }
    };

    const removeSingleImage = (key: 'logoUrl' | 'heroImage' | 'infoImage') => {
        setConfig(prev => ({ ...prev, [key]: "" }));
        const fileKey = key.replace('Url', '').replace('Image', '').toLowerCase() as 'logo' | 'hero' | 'info';
        setFiles(prev => ({ ...prev, [fileKey]: null }));
        setPreviews(prev => ({ ...prev, [fileKey]: null }));
    };

    // Definitions for search and sidebar
    const itemsDefinition = useMemo(() => [
        {
            id: "general",
            label: "General",
            icon: Settings,
            keywords: ["nombre", "sitio", "descripción", "seo", "titulo"]
        },
        {
            id: "contact",
            label: "Contacto",
            icon: MapPin,
            keywords: ["email", "correo", "telefono", "whatsapp", "direccion", "ubicacion", "contacto"]
        },
        {
            id: "visual",
            label: "Identidad Visual",
            icon: ImageIcon,
            keywords: ["logo", "imagen", "foto", "hero", "banner", "galeria", "fotos"]
        },
        {
            id: "api",
            label: "Integraciones API",
            icon: Server,
            keywords: ["api", "key", "secret", "cloudinary", "smtp", "correo", "servidor"]
        },
    ], []);

    const sidebarItems = useMemo(() => {
        if (!searchQuery) return itemsDefinition;

        const lowerQ = searchQuery.toLowerCase();
        return itemsDefinition.filter(item =>
            item.label.toLowerCase().includes(lowerQ) ||
            item.keywords.some(k => k.includes(lowerQ))
        );
    }, [searchQuery, itemsDefinition]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header Superior */}
            <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="h-8 w-8 rounded-md flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: 'lab(72.7183 31.8672 97.9407)' }}
                        >
                            <Settings className="h-4 w-4 text-white" />
                        </div>
                        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
                            <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                Configuración
                            </span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="text-white shadow-md transition-all active:scale-95 hover:opacity-90"
                            style={{ backgroundColor: 'lab(72.7183 31.8672 97.9407)' }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Cambios
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-10 grid md:grid-cols-[240px_1fr] gap-12">
                {/* Sidebar de Navegación */}
                <aside className="space-y-1 h-fit sticky top-24">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar ajuste..."
                            className="pl-9 h-9 bg-muted/50 border-border focus:ring-1 transition-all"
                            style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {sidebarItems.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground italic">
                            No se encontraron resultados.
                        </div>
                    ) : (
                        sidebarItems.map((item) => {
                            const isActive = activeSection === item.id;
                            const mainColor = "lab(72.7183 31.8672 97.9407)";

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 border border-transparent group",
                                        !isActive && "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                    style={isActive ? {
                                        backgroundColor: 'color-mix(in srgb, lab(72.7183 31.8672 97.9407) 10%, white)', // Light tint
                                        color: mainColor,
                                        borderColor: 'color-mix(in srgb, lab(72.7183 31.8672 97.9407) 50%, white)', // Lighter border
                                        fontWeight: 600
                                    } : {}}
                                >
                                    <div
                                        className={cn("transition-colors duration-200")}
                                        style={isActive ? { color: mainColor } : {}}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    {item.label}
                                </button>
                            );
                        })
                    )}
                </aside>

                {/* Contenido Principal */}
                <div className="space-y-10 min-h-[500px]">
                    <section className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuración del Proyecto</h1>
                        <p className="text-muted-foreground text-lg">
                            Administra la presencia digital y el comportamiento core de tu plataforma.
                        </p>
                    </section>

                    <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">

                        {/* === GENERAL === */}
                        <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Nombre del Sitio</CardTitle>
                                    <CardDescription>Identificador público para tu hotel / sitio web.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Input
                                        value={config.siteName}
                                        onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                                        className="max-w-md h-10 focus-visible:ring-1"
                                        style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Este nombre se utilizará en la pestaña del navegador y encabezados.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Descripción del Sitio</CardTitle>
                                    <CardDescription>Resumen para SEO y pie de página.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={config.siteDescription}
                                        onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                                        className="min-h-[120px] resize-none focus-visible:ring-1"
                                        style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* === CONTACTO === */}
                        <TabsContent value="contact" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Datos de Contacto</CardTitle>
                                    <CardDescription>Información visible para que los clientes te contacten.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Email de Soporte</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-9 focus-visible:ring-1"
                                                    style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                                    value={config.supportEmail}
                                                    onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Teléfono / WhatsApp</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-9 focus-visible:ring-1"
                                                    style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                                    value={config.phone}
                                                    onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Dirección Física</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-9 focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                                value={config.address}
                                                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* === VISUAL === */}
                        <TabsContent value="visual" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle>Identidad Visual</CardTitle>
                                    <CardDescription>Logotipo y banners principales.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid sm:grid-cols-2 gap-8">
                                    {/* LOGO */}
                                    <div className="space-y-4">
                                        <Label>Logotipo Principal</Label>
                                        <div className="relative group w-full">
                                            <Label htmlFor="upload-logo" className="cursor-pointer w-full block">
                                                <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-orange-50 hover:border-orange-200 transition-colors relative overflow-hidden w-full h-full min-h-[160px]">
                                                    {(previews.logo || config.logoUrl) ? (
                                                        <Image
                                                            src={previews.logo || config.logoUrl}
                                                            alt="Logo"
                                                            width={160}
                                                            height={160}
                                                            className="h-32 w-auto object-contain z-10"
                                                        />
                                                    ) : (
                                                        <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center shadow-sm border border-border group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 text-white font-medium">
                                                        Cambiar
                                                    </div>
                                                </div>
                                            </Label>
                                            {(previews.logo || config.logoUrl) && (
                                                <button
                                                    onClick={() => removeSingleImage('logoUrl')}
                                                    className="absolute -top-3 -right-3 h-8 w-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all hover:scale-110 active:scale-95 z-30"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                        <Input id="upload-logo" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect('logo', e)} />
                                        <div className="text-center text-xs text-muted-foreground">Recomendado: 512x512px Transparent PNG</div>
                                    </div>

                                    {/* HERO */}
                                    <div className="space-y-4">
                                        <Label>Imagen Portada (Hero)</Label>
                                        <div className="relative aspect-video rounded-xl bg-muted overflow-hidden border border-border group">
                                            {(previews.hero || config.heroImage) ? (
                                                <Image
                                                    src={previews.hero || config.heroImage}
                                                    alt="Hero"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground opacity-20" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 gap-2">
                                                <Label htmlFor="upload-hero" className="cursor-pointer">
                                                    <div className="bg-white text-black hover:bg-gray-100 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow-sm">
                                                        Reemplazar
                                                    </div>
                                                </Label>
                                            </div>
                                            {(previews.hero || config.heroImage) && (
                                                <button
                                                    onClick={() => removeSingleImage('heroImage')}
                                                    className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-20"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <Input id="upload-hero" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect('hero', e)} />
                                    </div>

                                    {/* INFO IMAGE */}
                                    <div className="space-y-4 sm:col-span-2">
                                        <Label>Imagen Sección Info</Label>
                                        <div className="relative aspect-[21/9] rounded-xl bg-muted overflow-hidden border border-border group">
                                            {(previews.info || config.infoImage) ? (
                                                <Image
                                                    src={previews.info || config.infoImage}
                                                    alt="Info"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="h-10 w-10 text-muted-foreground opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 gap-2">
                                                <Label htmlFor="upload-info" className="cursor-pointer">
                                                    <div className="bg-white text-black hover:bg-gray-100 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow-sm">
                                                        Reemplazar
                                                    </div>
                                                </Label>
                                            </div>
                                            {(previews.info || config.infoImage) && (
                                                <button
                                                    onClick={() => removeSingleImage('infoImage')}
                                                    className="absolute top-2 right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-20"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                        <Input id="upload-info" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect('info', e)} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* GALLERY */}
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Galería de Fotos</CardTitle>
                                        <CardDescription>Muestra las mejores áreas de tu hotel.</CardDescription>
                                    </div>
                                    <Label htmlFor="upload-gallery" className="cursor-pointer">
                                        <div
                                            className="text-white h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow-sm hover:opacity-90"
                                            style={{ backgroundColor: 'lab(72.7183 31.8672 97.9407)' }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Agregar
                                        </div>
                                    </Label>
                                    <Input id="upload-gallery" type="file" multiple className="hidden" accept="image/*" onChange={handleGallerySelect} />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {config.galleryImages.map((url, idx) => (
                                            <div key={`old-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                                                <Image src={url} alt="" fill className="object-cover" />
                                                <button
                                                    onClick={() => removeGalleryImage(idx, false)}
                                                    className="absolute top-2 right-2 h-6 w-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {previews.gallery.map((url, idx) => (
                                            <div key={`new-${idx}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 bg-muted" style={{ borderColor: 'lab(72.7183 31.8672 97.9407)' }}>
                                                <Image src={url} alt="" fill className="object-cover opacity-80" />
                                                <div className="absolute top-1 left-1 h-2 w-2 rounded-full" style={{ backgroundColor: 'lab(72.7183 31.8672 97.9407)' }} />
                                                <button
                                                    onClick={() => removeGalleryImage(idx, true)}
                                                    className="absolute top-2 right-2 h-6 w-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* === API & SECURITY === */}
                        <TabsContent value="api" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                            {/* CLOUDINARY */}
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Cloud className="h-5 w-5 text-blue-500" />
                                        <CardTitle>Cloudinary (Imágenes)</CardTitle>
                                    </div>
                                    <CardDescription>Credenciales para almacenamiento y optimización de imágenes.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Cloud Name</Label>
                                            <Input
                                                value={config.cloudinaryCloudName}
                                                onChange={(e) => setConfig({ ...config, cloudinaryCloudName: e.target.value })}
                                                className="font-mono bg-muted/50 focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>API Key</Label>
                                            <Input
                                                value={config.cloudinaryApiKey}
                                                onChange={(e) => setConfig({ ...config, cloudinaryApiKey: e.target.value })}
                                                className="font-mono bg-muted/50 focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>API Secret</Label>
                                            <Input
                                                type="password"
                                                value={config.cloudinaryApiSecret}
                                                onChange={(e) => setConfig({ ...config, cloudinaryApiSecret: e.target.value })}
                                                className="font-mono bg-muted/50 focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-md bg-blue-500/10 text-blue-600 text-xs">
                                        <Database className="h-4 w-4" />
                                        Requerido para subir logos y fotos a la galería.
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SMTP */}
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-orange-500" />
                                        <CardTitle>Servidor SMTP (Correos)</CardTitle>
                                    </div>
                                    <CardDescription>Configuración para envío de notificaciones automáticas.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Servidor Host</Label>
                                            <Input
                                                placeholder="smtp.gmail.com"
                                                value={config.smtpHost}
                                                onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                                                className="font-mono focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Puerto</Label>
                                            <Input
                                                placeholder="587"
                                                value={config.smtpPort}
                                                onChange={(e) => setConfig({ ...config, smtpPort: e.target.value })}
                                                className="font-mono focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Usuario / Email</Label>
                                            <Input
                                                value={config.smtpUser}
                                                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                                                className="font-mono focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Contraseña</Label>
                                            <Input
                                                type="password"
                                                value={config.smtpPass}
                                                onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                                                className="font-mono focus-visible:ring-1"
                                                style={{ '--ring-color': 'lab(72.7183 31.8672 97.9407)' } as React.CSSProperties}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main >


        </div >
    )
}
