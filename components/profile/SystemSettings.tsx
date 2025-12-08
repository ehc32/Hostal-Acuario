"use client"

import { useTheme } from 'next-themes'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SystemSettings() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const isDark = theme === 'dark'

    return (
        <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isDark ? (
                        <Moon className="w-5 h-5 text-primary" />
                    ) : (
                        <Sun className="w-5 h-5 text-primary" />
                    )}
                    <div>
                        <Label htmlFor="dark-mode" className="text-base font-medium">
                            Modo oscuro
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Activa el tema oscuro para una mejor experiencia visual
                        </p>
                    </div>
                </div>
                <Switch
                    id="dark-mode"
                    checked={isDark}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
            </div>
        </div>
    )
}
