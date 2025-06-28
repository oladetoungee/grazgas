'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AbiInput } from '@/components/abi-input';
import { FunctionSelector } from '@/components/function-selector';
import { ParameterInput } from '@/components/parameter-input';
import { SimulationResults } from '@/components/simulation-results';
import { TransactionBuilder } from '@/components/transaction-builder';
import { Activity, Zap, Code, Play } from 'lucide-react';

interface AbiFunction {
  name: string;
  type: string;
  inputs: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    internalType?: string;
  }>;
  stateMutability: string;
}

interface SimulationState {
  abi: AbiFunction[];
  selectedFunction: AbiFunction | null;
  contractAddress: string;
  parameters: Record<string, any>;
  simulationResult: any;
  isSimulating: boolean;
  error: string | null;
}

export default function TransactionSimulator() {
  const [state, setState] = useState<SimulationState>({
    abi: [],
    selectedFunction: null,
    contractAddress: '',
    parameters: {},
    simulationResult: null,
    isSimulating: false,
    error: null,
  });

  const updateState = (updates: Partial<SimulationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Transaction Simulator
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Test and debug smart contract transactions before sending them to
            the blockchain. Simulate execution, estimate gas costs, and preview
            results safely.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Gas Estimation</h3>
                <p className="text-sm text-blue-700">
                  Predict transaction costs
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Code className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">ABI Parsing</h3>
                <p className="text-sm text-green-700">
                  Automatic function detection
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 flex items-center gap-3">
              <Play className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-900">Safe Testing</h3>
                <p className="text-sm text-purple-700">No real transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Contract Configuration
                </CardTitle>
                <CardDescription>
                  Set up your smart contract details and ABI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="abi" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="abi">ABI & Address</TabsTrigger>
                    <TabsTrigger value="function">Function</TabsTrigger>
                  </TabsList>

                  <TabsContent value="abi" className="space-y-4">
                    <AbiInput
                      onAbiChange={(abi, address) =>
                        updateState({
                          abi,
                          contractAddress: address,
                          selectedFunction: null,
                        })
                      }
                      contractAddress={state.contractAddress}
                    />
                  </TabsContent>

                  <TabsContent value="function" className="space-y-4">
                    <FunctionSelector
                      abi={state.abi}
                      selectedFunction={state.selectedFunction}
                      onFunctionSelect={(func) =>
                        updateState({ selectedFunction: func, parameters: {} })
                      }
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {state.selectedFunction && (
              <Card>
                <CardHeader>
                  <CardTitle>Function Parameters</CardTitle>
                  <CardDescription>
                    Enter the parameters for {state.selectedFunction.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ParameterInput
                    functionAbi={state.selectedFunction}
                    parameters={state.parameters}
                    onParametersChange={(params) =>
                      updateState({ parameters: params })
                    }
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Simulation */}
          <div className="space-y-6">
            <TransactionBuilder
              contractAddress={state.contractAddress}
              selectedFunction={state.selectedFunction}
              parameters={state.parameters}
              onSimulate={(result, error) =>
                updateState({
                  simulationResult: result,
                  error,
                  isSimulating: false,
                })
              }
              onSimulationStart={() =>
                updateState({ isSimulating: true, error: null })
              }
              isSimulating={state.isSimulating}
            />

            <SimulationResults
              result={state.simulationResult}
              error={state.error}
              isSimulating={state.isSimulating}
              selectedFunction={state.selectedFunction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
