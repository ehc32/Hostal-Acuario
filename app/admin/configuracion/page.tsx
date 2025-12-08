"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"

export default function ConfiguracionPage() {
    const [loading, setLoading] = useState(false)

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Configuración guardada")
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                    Administra los parámetros generales del sistema.
                </p>
            </div>
            <Separator />

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="hotel">Información Hotel</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
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
                                <Input defaultValue="Hotel Acuario" />
                            </div>
                            <div className="space-y-1">
                                <Label>Email de Soporte</Label>
                                <Input defaultValue="soporte@hotelacuario.com" />
                            </div>
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
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
                                    <Input defaultValue="Calle Principal #123" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Teléfono</Label>
                                    <Input defaultValue="+57 300 000 0000" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
