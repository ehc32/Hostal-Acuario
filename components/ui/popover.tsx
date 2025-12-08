"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const PopoverContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => { } });

const Popover = ({ children, open: controlledOpen, onOpenChange }: any) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = onOpenChange || setUncontrolledOpen

    return (
        <PopoverContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block">{children}</div>
        </PopoverContext.Provider>
    )
}

const PopoverTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        const { open, setOpen } = React.useContext(PopoverContext)

        return (
            <div
                ref={ref}
                className={cn("inline-flex cursor-pointer", className)}
                onClick={() => setOpen(!open)}
                {...props}
            >
                {children}
            </div>
        )
    }
)
PopoverTrigger.displayName = "PopoverTrigger"

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "center" | "start" | "end"
    sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
    ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
        const { open } = React.useContext(PopoverContext)

        if (!open) return null

        return (
            <div
                ref={ref}
                style={{
                    position: 'absolute',
                    top: `calc(100% + ${sideOffset}px)`,
                    zIndex: 50
                }}
                className={cn(
                    "w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
                    align === "center" ? "left-1/2 -translate-x-1/2" : align === "end" ? "right-0" : "left-0",
                    className
                )}
                {...props}
            />
        )
    }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
