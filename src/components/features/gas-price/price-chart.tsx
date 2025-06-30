"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Skeleton } from "@/components/ui/skeleton"
import { GasPriceChartProps } from "@/types/gas-price";

function generateSimulatedData(gasData: any, range: "1h" | "24h" | "7d") {
  const data: any[] = []
  const now = new Date()

  let interval = 1
  let points = 60

  if (range === "24h") {
    interval = 30
    points = 48
  } else if (range === "7d") {
    interval = 720
    points = 14
  }

  const baseFee = parseFloat(gasData?.estimatedBaseFee || "0")
  const lowFee = parseFloat(gasData?.low?.suggestedMaxFeePerGas || "0")
  const mediumFee = parseFloat(gasData?.medium?.suggestedMaxFeePerGas || "0")
  const highFee = parseFloat(gasData?.high?.suggestedMaxFeePerGas || "0")

  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 1000)
    const variation = 0.1
    data.push({
      time: time.toISOString(),
      baseFee: +(baseFee * (1 + (Math.random() - 0.5) * variation)).toFixed(2),
      baseFeeLow: +(lowFee * (1 + (Math.random() - 0.5) * variation)).toFixed(2),
      baseFeeMedium: +(mediumFee * (1 + (Math.random() - 0.5) * variation)).toFixed(2),
      baseFeeHigh: +(highFee * (1 + (Math.random() - 0.5) * variation)).toFixed(2),
    })
  }

  return data
}

function transformHistoricalData(historicalData: any[], range: "1h" | "24h" | "7d") {
  if (!historicalData || historicalData.length === 0) return [];

  return historicalData.map(item => ({
    time: new Date(item.date).toISOString(),
    baseFee: parseFloat(item.baseFee || "0"),
    baseFeeLow: parseFloat(item.low || "0"),
    baseFeeMedium: parseFloat(item.medium || "0"),
    baseFeeHigh: parseFloat(item.high || "0"),
  }));
}

const chartConfig = {
  baseFee: { label: "Base", color: "#EF4444", },
  baseFeeLow: { label: "Low", color: "#2EB88A" },
  baseFeeMedium: { label: "Medium", color: "#fcba03" },
  baseFeeHigh: { label: "High", color: "#AF57DB", },
} satisfies ChartConfig

export default function GasPriceTrendChart({ 
  gasData, 
  historicalData, 
  loading, 
  selectedChain, 
  onRangeChange 
}: GasPriceChartProps) {
  const [timeRange, setTimeRange] = React.useState<"1h" | "24h" | "7d">("1h")
  const [data, setData] = React.useState<any[]>([])

  React.useEffect(() => {
    if (historicalData && historicalData.length > 0) {
      setData(transformHistoricalData(historicalData, timeRange));
    } else if (gasData) {
      setData(generateSimulatedData(gasData, timeRange));
    }
  }, [timeRange, gasData, historicalData])

  const handleRangeChange = (range: string) => {
    const newRange = range as "1h" | "24h" | "7d";
    setTimeRange(newRange);
    onRangeChange(range);
  };

  const formatXAxisTick = (value: string) => {
    const date = new Date(value)
    
    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", {
        weekday: "short"
      })
    } else if (timeRange === "24h") {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true
      })
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      })
    }
  }

  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-[160px]" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!gasData && !historicalData) {
    return (
      <Card className="pt-0">
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No gas price data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Gas Fee Area Chart</CardTitle>
          <CardDescription>
            {historicalData && historicalData.length > 0 
              ? "Real historical data" 
              : "Simulated data based on current prices"
            }
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={handleRangeChange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              {["baseFee", "baseFeeLow", "baseFeeMedium", "baseFeeHigh"].map((key) => (
                <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={formatXAxisTick}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("en-US", {
                      weekday: "short",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="baseFeeLow"
              type="natural"
              fill="url(#fillbaseFeeLow)"
              stroke="var(--color-baseFeeLow)"
              stackId="a"
            />
            <Area
              dataKey="baseFeeMedium"
              type="natural"
              fill="url(#fillbaseFeeMedium)"
              stroke="var(--color-baseFeeMedium)"
              stackId="a"
            />
            <Area
              dataKey="baseFeeHigh"
              type="natural"
              fill="url(#fillbaseFeeHigh)"
              stroke="var(--color-baseFeeHigh)"
              stackId="a"
            />
            <Area
              dataKey="baseFee"
              type="natural"
              fill="url(#fillbaseFee)"
              stroke="var(--color-baseFee)"
              stackId="a"
            />
            <ChartLegend>
              <ChartLegendContent />
            </ChartLegend>

          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
