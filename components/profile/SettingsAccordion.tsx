"use client"

import { Settings } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChangePasswordForm } from './ChangePasswordForm'
import { SystemSettings } from './SystemSettings'
import { DeleteAccount } from './DeleteAccount'

export function SettingsAccordion() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-primary/10 p-2">
                    <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Configuración</h3>
                    <p className="text-sm text-muted-foreground">Gestiona la seguridad y preferencias de tu cuenta</p>
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="password">
                    <AccordionTrigger>Cambiar contraseña</AccordionTrigger>
                    <AccordionContent>
                        <ChangePasswordForm />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="system">
                    <AccordionTrigger>Configuración del sistema</AccordionTrigger>
                    <AccordionContent>
                        <SystemSettings />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delete">
                    <AccordionTrigger className="text-destructive">Desactivar cuenta</AccordionTrigger>
                    <AccordionContent>
                        <DeleteAccount />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
