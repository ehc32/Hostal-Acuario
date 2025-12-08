"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// 👇 AHORA SE PERMITE name: string | null
const formSchema = z.object({
    id: z.number(),
    name: z.string().min(2, { message: "Nombre muy corto" }).nullable(),
    role: z.string(),
    status: z.string(),
});

export type ClientFormData = z.infer<typeof formSchema>;

// IMPORTANTE: El formulario recibe un User real que puede tener name null
interface ClientFormProps {
    user: {
        id: number;
        name: string | null;
        role: string;
        status: string;
    };
    onSave: (data: ClientFormData) => Promise<void>;
    onCancel: () => void;
}

export function ClientForm({ user, onSave, onCancel }: ClientFormProps) {
    const form = useForm<ClientFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: user.id,
            name: user.name ?? "",   // ← convierte null en string
            role: user.role ?? "USER",
            status: user.status ?? "ACTIVE",
        },
    });

    async function onSubmit(values: ClientFormData) {
        await onSave(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Nombre */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Nombre" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Rol */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="USER">Usuario</SelectItem>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Estado */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Activo</SelectItem>
                                    <SelectItem value="DELETED">Inactivo / Eliminado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Guardar Cambios
                    </Button>
                </div>

            </form>
        </Form>
    );
}
