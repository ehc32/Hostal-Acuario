"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

export function ProfileInfo() {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    })

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                // Actualizar localStorage y contexto
                localStorage.setItem('user', JSON.stringify(data.user))
                updateUser(formData)
                setIsEditing(false)
                toast.success('Perfil actualizado correctamente')
            } else {
                toast.error(data.error || 'Error al actualizar el perfil')
            }
        } catch (error) {
            toast.error('Error al actualizar el perfil')
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            phone: user?.phone || '',
        })
        setIsEditing(false)
    }

    if (!user) return null

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Información Personal</h3>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                    </Button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button onClick={handleSave} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="flex-1">
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Nombre Completo</Label>
                        <Input disabled value={user.name || ''} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input disabled value={user.email} className="bg-muted/50 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input disabled value={user.phone || ''} className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label>Rol</Label>
                        <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground capitalize">
                            {user.role}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Última sesión</Label>
                        <Input
                            disabled
                            value={user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Nunca'}
                            className="bg-muted"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
