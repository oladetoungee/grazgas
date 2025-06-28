"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Zap, Activity, FileText, AlertTriangle } from "lucide-react"

interface AbiFunction {
  name: string
  outputs: Array<{
    name: string
    type: string
  }>
}

interface SimulationResult {
  success: boolean
  returnValue: any
  gasUsed: number
  gasPrice: string
  blockNumber: number
  logs: Array<{
    address: string
    topics: string[]
    data: string
  }>
}

interface SimulationResultsProps {
  result: SimulationResult | null
  error: string | null
  isSimulating: boolean
  selectedFunction: AbiFunction | null
}

export function SimulationResults({ result, error, isSimulating, selectedFunction }: SimulationResultsProps) {
  const formatGas = (gas: number) => {
    return gas.toLocaleString()
  }

  const formatGwei = (wei: string) => {
    const gwei = Number.parseInt(wei) / 1e9
    return `${gwei} Gwei`
  }

  const formatReturnValue = (value: any, functionAbi: AbiFunction | null) => {
    if (!functionAbi || !functionAbi.outputs.length) return "No return value"

    if (typeof value === "string") {
      // Try to format common return types
      if (value === "true" || value === "false") {
        return value
      }

      // Check if it's a large number (likely wei)
      if (/^\d+$/.test(value) && value.length > 10) {
        const eth = Number.parseInt(value) / 1e18
        return `${value} wei (${eth.toFixed(6)} ETH)`
      }

      return value
    }

    return JSON.stringify(value, null, 2)
  }

  if (isSimulating) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="font-medium">Simulating Transaction</h3>
              <p className="text-sm text-slate-600">This may take a few seconds...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="w-5 h-5" />
            Simulation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-mono text-sm">{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8">
          <div className="text-center text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="font-medium mb-2">No Simulation Yet</h3>
            <p className="text-sm">Configure your transaction and click simulate to see results</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={result.success ? "border-green-200" : "border-red-200"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${result.success ? "text-green-700" : "text-red-700"}`}>
          {result.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          Simulation {result.success ? "Successful" : "Failed"}
        </CardTitle>
        <CardDescription>
          Transaction simulation completed at block #{result.blockNumber.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gas">Gas Analysis</TabsTrigger>
            <TabsTrigger value="logs">Logs & Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">Status</Label>
                <Badge variant={result.success ? "default" : "destructive"} className="w-fit">
                  {result.success ? "Success" : "Failed"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">Block Number</Label>
                <p className="font-mono text-sm">#{result.blockNumber.toLocaleString()}</p>
              </div>
            </div>

            {selectedFunction && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600">Return Value</Label>
                <div className="bg-slate-50 rounded-lg p-3">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {formatReturnValue(result.returnValue, selectedFunction)}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Gas Used</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formatGas(result.gasUsed)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Gas Price</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatGwei(result.gasPrice)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-600">Estimated Cost</Label>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="font-mono text-sm">
                  {((result.gasUsed * Number.parseInt(result.gasPrice)) / 1e18).toFixed(6)} ETH
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatGas(result.gasUsed)} gas × {formatGwei(result.gasPrice)}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {result.logs.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {result.logs.map((log, index) => (
                    <Card key={index} className="bg-slate-50">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium text-sm">Event #{index + 1}</span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div>
                              <span className="font-medium">Address:</span>
                              <span className="font-mono ml-2">{log.address}</span>
                            </div>

                            <div>
                              <span className="font-medium">Topics:</span>
                              <div className="ml-2 space-y-1">
                                {log.topics.map((topic, i) => (
                                  <div key={i} className="font-mono break-all">
                                    [{i}] {topic}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="font-medium">Data:</span>
                              <div className="font-mono ml-2 break-all">{log.data}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No events were emitted during this simulation</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
