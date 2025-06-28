"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface AbiFunction {
  name: string
  inputs: Array<{
    name: string
    type: string
    internalType?: string
  }>
}

interface ParameterInputProps {
  functionAbi: AbiFunction
  parameters: Record<string, any>
  onParametersChange: (params: Record<string, any>) => void
}

export function ParameterInput({ functionAbi, parameters, onParametersChange }: ParameterInputProps) {
  const [localParams, setLocalParams] = useState<Record<string, any>>(parameters)

  useEffect(() => {
    setLocalParams(parameters)
  }, [parameters])

  const handleParameterChange = (paramName: string, value: any) => {
    const newParams = { ...localParams, [paramName]: value }
    setLocalParams(newParams)
    onParametersChange(newParams)
  }

  const getInputComponent = (input: { name: string; type: string }) => {
    const { name, type } = input
    const value = localParams[name] || ""

    // Handle different Solidity types
    if (type === "bool") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => handleParameterChange(name, checked)}
          />
          <span className="text-sm">{value ? "true" : "false"}</span>
        </div>
      )
    }

    if (type.includes("[]")) {
      return (
        <div className="space-y-2">
          <Textarea
            placeholder={`Enter ${type} values (JSON array format)\nExample: ["0x123...", "0x456..."]`}
            value={typeof value === "string" ? value : JSON.stringify(value || [])}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleParameterChange(name, parsed)
              } catch {
                handleParameterChange(name, e.target.value)
              }
            }}
            className="font-mono text-sm"
            rows={3}
          />
          <p className="text-xs text-slate-500">Enter as JSON array, e.g., ["value1", "value2"]</p>
        </div>
      )
    }

    if (type.startsWith("uint") || type.startsWith("int")) {
      return (
        <Input
          type="text"
          placeholder={`Enter ${type} value`}
          value={value}
          onChange={(e) => handleParameterChange(name, e.target.value)}
          className="font-mono"
        />
      )
    }

    if (type === "address") {
      return (
        <Input
          type="text"
          placeholder="0x..."
          value={value}
          onChange={(e) => handleParameterChange(name, e.target.value)}
          className="font-mono"
        />
      )
    }

    if (type === "bytes" || type.startsWith("bytes")) {
      return (
        <Input
          type="text"
          placeholder="0x..."
          value={value}
          onChange={(e) => handleParameterChange(name, e.target.value)}
          className="font-mono"
        />
      )
    }

    // Default string input
    return (
      <Input
        type="text"
        placeholder={`Enter ${type} value`}
        value={value}
        onChange={(e) => handleParameterChange(name, e.target.value)}
        className="font-mono"
      />
    )
  }

  const getTypeColor = (type: string) => {
    if (type === "address") return "bg-purple-100 text-purple-800"
    if (type.startsWith("uint") || type.startsWith("int")) return "bg-blue-100 text-blue-800"
    if (type === "bool") return "bg-green-100 text-green-800"
    if (type.includes("bytes")) return "bg-orange-100 text-orange-800"
    if (type.includes("[]")) return "bg-pink-100 text-pink-800"
    return "bg-gray-100 text-gray-800"
  }

  if (functionAbi.inputs.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>This function doesn't require any parameters.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {functionAbi.inputs.map((input, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`param-${index}`} className="font-medium">
              {input.name || `param${index}`}
            </Label>
            <Badge variant="outline" className={`text-xs ${getTypeColor(input.type)}`}>
              {input.type}
            </Badge>
          </div>

          <div id={`param-${index}`}>{getInputComponent(input)}</div>

          {input.type === "address" && <p className="text-xs text-slate-500">Enter a valid Ethereum address (0x...)</p>}

          {(input.type.startsWith("uint") || input.type.startsWith("int")) && (
            <p className="text-xs text-slate-500">
              Enter a number (can use scientific notation like 1e18 for large values)
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
