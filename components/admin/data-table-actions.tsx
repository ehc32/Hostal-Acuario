"use client"

import * as React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "¿Estás seguro?",
    description = "Esta acción desactivará el elemento seleccionado.",
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => Promise<void>
    title?: string
    description?: string
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        onConfirm();
                    }}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function EditDialog({
    open,
    onOpenChange,
    title,
    description,
    children
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
