"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [formData, setFormData] = useState({
        siteName: "",
        supportEmail: "",
        address: "",
        phone: "",
        cloudinaryCloudName: "",
        cloudinaryApiKey: "",
        cloudinaryApiSecret: "",
        smtpHost: "",
        smtpPort: "",
        smtpUser: "",
        smtpPass: ""
    })

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = localStorage.getItem("token")
                const headers: HeadersInit = {}
                if (token) headers["Authorization"] = `Bearer ${token}`

                const res = await fetch("/api/admin/config", { headers })
                if (res.ok) {
                    const data = await res.json()
                    setFormData({
                        siteName: data.siteName || "",
                        supportEmail: data.supportEmail || "",
                        address: data.address || "",
                        phone: data.phone || "",
                        cloudinaryCloudName: data.cloudinaryCloudName || "",
                        cloudinaryApiKey: data.cloudinaryApiKey || "",
                        cloudinaryApiSecret: data.cloudinaryApiSecret || "",
                        smtpHost: data.smtpHost || "smtp.gmail.com",
                        smtpPort: data.smtpPort || "587",
                        smtpUser: data.smtpUser || "",
                        smtpPass: data.smtpPass || ""
                    })
                }
            } catch (error) {
                console.error("Error cargando configuración", error)
                toast.error("Error al cargar la configuración")
            } finally {
                setFetching(false)
            }
        }
        fetchConfig()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const headers: HeadersInit = { "Content-Type": "application/json" }
            if (token) headers["Authorization"] = `Bearer ${token}`

            const res = await fetch("/api/admin/config", {
                method: "PUT",
                headers,
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || "Error al guardar")
            }

            toast.success("Configuración guardada correctamente")
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "No se pudieron guardar los cambios")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Configuración</h3>
                    <p className="text-sm text-muted-foreground">
                        Administra los parámetros generales del sistema.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Todo
                </Button>
            </div>
            <Separator />

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="hotel">Información Hotel</TabsTrigger>
                    <TabsTrigger value="crendeciales">Credenciales API</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencias Generales</CardTitle>
                            <CardDescription>
                                Configura el comportamiento básico de la aplicación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Nombre del Sitio</Label>
                                <Input name="siteName" value={formData.siteName} onChange={handleChange} placeholder="Ej: Hostal Acuario" />
                            </div>
                            <div className="space-y-1">
                                <Label>Email de Soporte</Label>
                                <Input name="supportEmail" value={formData.supportEmail} onChange={handleChange} placeholder="soporte@ejemplo.com" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hotel" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Hotel</CardTitle>
                            <CardDescription>Información visible en facturas y contacto</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Dirección</Label>
                                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="Calle Principal #123" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Teléfono</Label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+57 300 000 0000" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="crendeciales" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credenciales</CardTitle>
                            <CardDescription>Configuración crítica de servicios externos (Cloudinary, Email)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Cloudinary (Imágenes)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Cloud Name</Label>
                                        <Input name="cloudinaryCloudName" value={formData.cloudinaryCloudName} onChange={handleChange} placeholder="Ej: dogaloo3p" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>API Key</Label>
                                        <Input name="cloudinaryApiKey" value={formData.cloudinaryApiKey} onChange={handleChange} placeholder="Ej: 123456789" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>API Secret</Label>
                                        <Input name="cloudinaryApiSecret" value={formData.cloudinaryApiSecret} onChange={handleChange} type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground">SMTP (Correo Transaccional)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Host</Label>
                                        <Input name="smtpHost" value={formData.smtpHost} onChange={handleChange} placeholder="smtp.gmail.com" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Port</Label>
                                        <Input name="smtpPort" value={formData.smtpPort} onChange={handleChange} placeholder="587" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>User (Email)</Label>
                                        <Input name="smtpUser" value={formData.smtpUser} onChange={handleChange} placeholder="tu-email@gmail.com" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Password (App Password)</Label>
                                        <Input name="smtpPass" value={formData.smtpPass} onChange={handleChange} type="password" placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
