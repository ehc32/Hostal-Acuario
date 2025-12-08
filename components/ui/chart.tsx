"use client"

import * as React from "react"
import { ResponsiveContainer, Tooltip } from "recharts"

const ChartContext = React.createContext<any>(null)

export type ChartConfig = Record<string, { label: string; color?: string; icon?: any }>

export const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { config: ChartConfig; children: React.ComponentProps<typeof ResponsiveContainer>["children"] }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                ref={ref}
                className={className}
                {...props}
            >
                <style dangerouslySetInnerHTML={{
                    __html: Object.entries(config).map(([key, value]) => `
          [data-chart=${chartId}] {
            --color-${key}: ${value.color};
          }
        `).join('\n')
                }} />
                {children}
            </div>
        </ChartContext.Provider>
    )
})
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = Tooltip

export const ChartTooltipContent = React.forwardRef<any, any>(
    ({ active, payload, className, indicator = "dot", hideLabel = false, formatter, color, nameKey, labelKey }, ref) => {
        if (!active || !payload?.length) return null
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm text-xs grid gap-1">
                {payload.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: item.fill || item.color }} />
                        <span className="font-medium">{item.name}:</span>
                        <span className="text-muted-foreground">{item.value}</span>
                    </div>
                ))}
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltipContent"
