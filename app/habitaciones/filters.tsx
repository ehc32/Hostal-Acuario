"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function HabitacionesFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("q") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) params.set("q", debouncedSearch)
        else params.delete("q")
        router.replace(`/habitaciones?${params.toString()}`)
    }, [debouncedSearch, searchParams, router])

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
                </div>

                <Input
                    placeholder="Buscar por nombre, ubicación o características..."
                    className={cn(
                        "w-full pl-12 pr-12 h-14 rounded-full",
                        "border-muted bg-background/50 backdrop-blur-sm",
                        "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)]",
                        "hover:border-primary/30 hover:shadow-md hover:bg-background",
                        "focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary/50",
                        "transition-all duration-300 text-base"
                    )}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-4 flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:scale-110 transition-all p-1"
                        type="button"
                    >
                        <div className="bg-muted p-1 rounded-full">
                            <X className="h-3 w-3" />
                        </div>
                    </button>
                )}
            </div>
        </div>
    )
}
