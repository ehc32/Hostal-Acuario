import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
    text?: string
    title?: string
    description?: string
}

export function LoadingScreen({ text, title, description }: LoadingScreenProps) {
    // Soporte retrocompatible: si pasan title/desc, usarlos. Si solo pasan text, usarlo como título.
    const mainText = title || text || "Cargando..."

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
