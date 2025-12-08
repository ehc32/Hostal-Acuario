"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

/* ------------------------------------------------------------------
   TYPES
------------------------------------------------------------------ */

// Tooltip payload type according to Recharts
export interface ChartDataPoint {
    name?: string;
    value?: number | string;
    fill?: string;
    color?: string;
}

// Config type (icon is ReactNode instead of any)
export type ChartConfig = Record<
    string,
    { label: string; color?: string; icon?: React.ReactNode }
>;

// Chart context type
interface ChartContextType {
    config: ChartConfig;
}

/* ------------------------------------------------------------------
   CONTEXT
------------------------------------------------------------------ */

const ChartContext = React.createContext<ChartContextType | null>(null);

/* ------------------------------------------------------------------
   CHART CONTAINER
------------------------------------------------------------------ */

export const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig;
        children: React.ReactNode;
    }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div data-chart={chartId} ref={ref} className={className} {...props}>
                <style
                    dangerouslySetInnerHTML={{
                        __html: Object.entries(config)
                            .map(
                                ([key, value]) => `
          [data-chart=${chartId}] {
            --color-${key}: ${value.color};
          }
        `
                            )
                            .join("\n"),
                    }}
                />
                {children}
            </div>
        </ChartContext.Provider>
    );
});
ChartContainer.displayName = "ChartContainer";

/* ------------------------------------------------------------------
   TOOLTIP (wrapper)
------------------------------------------------------------------ */

export const ChartTooltip = Tooltip;

/* ------------------------------------------------------------------
   TOOLTIP CONTENT (FULLY TYPED)
------------------------------------------------------------------ */

interface ChartTooltipContentProps
    extends TooltipProps<number, string> {
    className?: string;
    indicator?: "dot" | "square";
    hideLabel?: boolean;
    formatter?: (value: unknown) => React.ReactNode;
    color?: string;
    nameKey?: string;
    labelKey?: string;
}

export const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    ChartTooltipContentProps
>(({ active, payload, className }, ref) => {
    if (!active || !payload?.length) return null;

    return (
        <div
            ref={ref}
            className="rounded-lg border bg-background p-2 shadow-sm text-xs grid gap-1"
        >
            {payload.map((item, index) => {
                const data = item as unknown as ChartDataPoint;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="h-2.5 w-2.5 rounded-[2px]"
                            style={{
                                backgroundColor: data.fill || data.color,
                            }}
                        />
                        <span className="font-medium">{data.name}:</span>
                        <span className="text-muted-foreground">
                            {data.value}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

ChartTooltipContent.displayName = "ChartTooltipContent";
