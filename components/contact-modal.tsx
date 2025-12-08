"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Send } from "lucide-react"

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-2xl">
                <div className="grid md:grid-cols-2 h-full">

                    {/* Columna Izquierda: Info de Contacto (Oscura) */}
                    <div className="bg-zinc-900 text-white p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Contáctanos</h3>
                            <p className="text-zinc-400 mb-8 max-w-xs">
                                ¿Tienes preguntas? Estamos aquí para ayudarte a planificar tu estancia perfecta.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-zinc-800 p-2 rounded-lg">
                                        <Phone className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Llámanos</p>
                                        <p className="text-zinc-400 text-sm">+57 300 123 4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-zinc-800 p-2 rounded-lg">
                                        <Mail className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Escríbenos</p>
                                        <p className="text-zinc-400 text-sm">reservas@hotelacuario.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-zinc-800 p-2 rounded-lg">
                                        <MapPin className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Visítanos</p>
                                        <p className="text-zinc-400 text-sm max-w-[200px]">
                                            Km 5 Vía al Mar, Cartagena de Indias, Colombia
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-zinc-800">
                            <p className="text-xs text-zinc-500">
                                Horario de Atención: 24/7
                            </p>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario (Clara) */}
                    <div className="p-8 bg-white dark:bg-zinc-950">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-zinc-800 dark:text-gray-100">Envíanos un mensaje</DialogTitle>
                            <DialogDescription>
                                Te responderemos lo antes posible.
                            </DialogDescription>
                        </DialogHeader>

                        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre</label>
                                    <Input placeholder="Tu nombre" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Apellido</label>
                                    <Input placeholder="Tu apellido" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Correo Electrónico</label>
                                <Input type="email" placeholder="ejemplo@correo.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mensaje</label>
                                <Textarea placeholder="Cuéntanos en qué podemos ayudarte..." className="min-h-[120px]" />
                            </div>

                            <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white" size="lg">
                                <Send className="w-4 h-4 mr-2" /> Enviar Mensaje
                            </Button>
                        </form>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
