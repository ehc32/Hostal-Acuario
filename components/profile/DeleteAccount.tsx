"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteAccount() {
    const [confirmText, setConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (confirmText !== 'ELIMINAR') {
            toast.error('Debes escribir "ELIMINAR" para confirmar')
            return
        }

        setIsDeleting(true)

        try {
            const token = localStorage.getItem('token')

            const response = await fetch('/api/auth/update', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Cuenta desactivada exitosamente')
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            } else {
                toast.error(data.error || 'Error al desactivar la cuenta')
                setIsDeleting(false)
            }
        } catch (error) {
            toast.error('Error al desactivar la cuenta')
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-4 pt-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-destructive mb-1">Desactivar cuenta</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Tu cuenta será desactivada y no podrás iniciar sesión. Los administradores aún podrán ver tu información.
                        </p>

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="confirm">
                                    Escribe <span className="font-bold">ELIMINAR</span> para confirmar
                                </Label>
                                <Input
                                    id="confirm"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="ELIMINAR"
                                    disabled={isDeleting}
                                />
                            </div>

                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleDelete}
                                disabled={confirmText !== 'ELIMINAR' || isDeleting}
                            >
                                {isDeleting ? 'Desactivando cuenta...' : 'Desactivar mi cuenta'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
