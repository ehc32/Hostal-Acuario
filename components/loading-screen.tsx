import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
    text?: string
    title?: string
    description?: string
    fullscreen?: boolean
}

export function LoadingScreen({ text, title, description, fullscreen = false }: LoadingScreenProps) {
    const mainText = title || text || "Cargando..."

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="space-y-2 text-center">
                    <p className="text-xl font-medium text-foreground">{mainText}</p>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <div className="space-y-2">
                <p className="text-lg font-medium text-foreground animate-pulse">{mainText}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </div>
    )
}
