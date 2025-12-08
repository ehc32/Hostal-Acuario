"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export function ChangePasswordForm() {
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        if (formData.newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Contraseña actualizada correctamente')
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
        } catch (error) {
            toast.error('Error al cambiar la contraseña')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="current">Contraseña actual</Label>
                <div className="relative">
                    <Input
                        id="current"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        required
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="new">Nueva contraseña</Label>
                <div className="relative">
                    <Input
                        id="new"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                        minLength={6}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
                <div className="relative">
                    <Input
                        id="confirm"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
        </form>
    )
}
