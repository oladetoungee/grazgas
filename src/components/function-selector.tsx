"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Edit, Zap } from "lucide-react"

interface AbiFunction {
  name: string
  type: string
  inputs: Array<{
    name: string
    type: string
    internalType?: string
  }>
  outputs: Array<{
    name: string
    type: string
    internalType?: string
  }>
  stateMutability: string
}

interface FunctionSelectorProps {
  abi: AbiFunction[]
  selectedFunction: AbiFunction | null
  onFunctionSelect: (func: AbiFunction) => void
}

export function FunctionSelector({ abi, selectedFunction, onFunctionSelect }: FunctionSelectorProps) {
  if (abi.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Edit className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Parse an ABI first to see available functions</p>
      </div>
    )
  }

  const getStateMutabilityIcon = (stateMutability: string) => {
    switch (stateMutability) {
      case "view":
      case "pure":
        return <Eye className="w-4 h-4" />
      case "payable":
        return <Zap className="w-4 h-4" />
      default:
        return <Edit className="w-4 h-4" />
    }
  }

  const getStateMutabilityColor = (stateMutability: string) => {
    switch (stateMutability) {
      case "view":
      case "pure":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "payable":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Available Functions ({abi.length})</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>View</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Write</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Payable</span>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {abi.map((func, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedFunction?.name === func.name ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-slate-50"
              }`}
              onClick={() => onFunctionSelect(func)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStateMutabilityIcon(func.stateMutability)}
                      <span className="font-mono font-medium text-sm truncate">{func.name}</span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      {func.inputs.length > 0 && (
                        <div>
                          <span className="font-medium">Inputs:</span>{" "}
                          {func.inputs.map((input) => `${input.type} ${input.name}`).join(", ")}
                        </div>
                      )}
                      {func.outputs.length > 0 && (
                        <div>
                          <span className="font-medium">Returns:</span>{" "}
                          {func.outputs.map((output) => output.type).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${getStateMutabilityColor(func.stateMutability)}`}
                  >
                    {func.stateMutability}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
