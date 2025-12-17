"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2, CheckCircle, AlertCircle, File, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function CsvImportDialog() {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [summary, setSummary] = useState<{ imported: number; failed: number } | null>(null)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setSummary(null)
            setProgress(0)
        }
    }

    const parseCSV = (text: string) => {
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

        const data = []
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            // Basic CSV split ignoring commas inside quotes logic for simplicity since user asked for "fast"
            // For production with complex CSVs, a library like papaparse is recommended.
            // Assuming simple CSV: title,price,priceHour,climate,description,holder
            const values = lines[i].split(',')

            if (values.length < 2) continue // Skip invalid lines

            const entry: Record<string, string> = {}
            headers.forEach((h, index) => {
                entry[h] = values[index]?.trim() || ""
            })
            data.push(entry)
        }
        return data
    }

    const handleImport = async () => {
        if (!file) return

        try {
            setLoading(true)
            setProgress(10) // Reading

            const text = await file.text()
            const data = parseCSV(text)

            if (data.length === 0) {
                toast.error("No se encontraron datos válidos en el CSV")
                setLoading(false)
                return
            }

            setProgress(30) // Sending

            const token = localStorage.getItem("token")
            const res = await fetch("/api/admin/rooms/import", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ rooms: data }),
            })

            setProgress(80) // Processing response

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Error al importar")
            }

            const result = await res.json()
            setSummary({ imported: result.imported, failed: result.failed })
            setProgress(100)

            toast.success(`Importación completada: ${result.imported} creadas`)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Error al procesar el archivo")
            setProgress(0)
        } finally {
            setLoading(false)
            // No cerramos el modal automáticamente para que vea el resumen
        }
    }

    const reset = () => {
        setFile(null)
        setSummary(null)
        setProgress(0)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !loading && (val ? setOpen(true) : reset())}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Importar CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Importar Habitaciones</DialogTitle>
                    <DialogDescription>
                        Sube un archivo CSV con las columnas: title, price, priceHour, climate, description
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!summary ? (
                        <div className="flex flex-col items-center gap-4">
                            <label
                                htmlFor="csv-upload"
                                className={`
                                    flex flex-col items-center justify-center w-full h-32 
                                    border-2 border-dashed rounded-lg cursor-pointer 
                                    hover:bg-slate-50 transition-colors
                                    ${file ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300'}
                                `}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {loading ? (
                                        <Loader2 className="h-8 w-8 text-slate-400 animate-spin mb-2" />
                                    ) : (
                                        <Upload className={`h-8 w-8 mb-2 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    )}
                                    <p className="text-sm text-slate-500 font-medium">
                                        {file ? file.name : "Click para seleccionar archivo"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Soporta .csv</p>
                                </div>
                                <input
                                    id="csv-upload"
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </label>

                            {progress > 0 && (
                                <div className="w-full space-y-1">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-xs text-center text-muted-foreground">Procesando...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4 space-y-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-semibold text-lg">¡Proceso Terminado!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Se importaron <span className="font-bold text-slate-900">{summary.imported}</span> habitaciones correctamente.
                                </p>
                                {summary.failed > 0 && (
                                    <p className="text-xs text-red-500 flex items-center justify-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {summary.failed} fallaron
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between flex-row items-center gap-2">
                    {!summary ? (
                        <>
                            <Button type="button" variant="outline" onClick={reset} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleImport} disabled={!file || loading}>
                                {loading ? "Importando..." : "Comenzar Importación"}
                            </Button>
                        </>
                    ) : (
                        <Button type="button" onClick={reset} className="w-full">
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
