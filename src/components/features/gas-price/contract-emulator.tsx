"use client";

import { useState, useEffect } from "react";
import { processAbi, estimateGas } from "@/lib/contract-actions";
import { FunctionFragment, GasEstimate } from "@/types/contract";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GasEstimateDialog from "./gas-estimate-dialog";
import Instructions from "./instructions";

export default function ContractInteraction() {
  const [contractAddress, setContractAddress] = useState("");
  const [abiInput, setAbiInput] = useState("");
  const [callableFunctions, setCallableFunctions] = useState<FunctionFragment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showViewFunctions, setShowViewFunctions] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimationError, setEstimationError] = useState<string | null>(null);
  const [showGasDialog, setShowGasDialog] = useState(false);
  const [functionParams, setFunctionParams] = useState<Record<string, Record<string, string>>>({});
  const [estimatingFunctions, setEstimatingFunctions] = useState<Record<string, boolean>>({});
  const [selectedChain, setSelectedChain] = useState("ethereum");

  useEffect(() => {
    const timeoutId = setTimeout(() => processAbi(contractAddress, abiInput, setCallableFunctions, setError, setIsLoading), 500);
    return () => clearTimeout(timeoutId);
  }, [contractAddress, abiInput]);



  // Initialize parameters for functions when they change
  useEffect(() => {
    const newParams: Record<string, Record<string, string>> = {};
    callableFunctions.forEach((func) => {
      newParams[func.name] = func.inputs.reduce((acc, input, index) => {
        acc[`param${index}`] = '';
        return acc;
      }, {} as Record<string, string>);
    });
    setFunctionParams(newParams);
  }, [callableFunctions]);

  const handleEstimateGas = async (func: FunctionFragment, params: Record<string, string>) => {
    await estimateGas(
      func,
      contractAddress,
      abiInput,
      params,
      selectedChain,
      (result) => {
        setGasEstimate(result);
        setShowGasDialog(true);
      },
      setEstimationError,
      setIsEstimating
    );
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Smart Contract Analysis</h2>

      <div className="space-y-6">
        {/* Instructions */}
        <Instructions />

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Network</label>
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="bsc">BSC</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contract Address</label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Contract ABI (JSON)</label>
            <textarea
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 min-h-[120px] resize-y font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Error or Loading States */}
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700 text-sm">{error}</p></div>}
        {isLoading && <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-blue-700 text-sm">Processing ABI...</p></div>}

        {/* Functions Display */}
        {callableFunctions.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold">Callable Functions ({callableFunctions.length})</h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showViewFunctions}
                    onChange={(e) => setShowViewFunctions(e.target.checked)}
                    className="rounded"
                  />
                  Show View/Pure Functions
                </label>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {callableFunctions
                .filter(func => showViewFunctions || (func.stateMutability !== 'view' && func.stateMutability !== 'pure'))
                .map((func, index) => {
                  const funcParams = functionParams[func.name] || {};
                  const isFuncEstimating = estimatingFunctions[func.name] || false;

                  const updateFuncParam = (paramIndex: number, value: string) => {
                    setFunctionParams(prev => ({
                      ...prev,
                      [func.name]: {
                        ...prev[func.name],
                        [`param${paramIndex}`]: value
                      }
                    }));
                  };

                  const handleEstimateForFunction = async () => {
                    setEstimatingFunctions(prev => ({ ...prev, [func.name]: true }));
                    await handleEstimateGas(func, funcParams);
                    setEstimatingFunctions(prev => ({ ...prev, [func.name]: false }));
                  };

                  return (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white dark:bg-gray-700 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{func.name}</span>
                          {func.stateMutability !== 'view' && func.stateMutability !== 'pure' && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full">
                              Gas Estimatable
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          func.stateMutability === 'view' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {func.stateMutability}
                          {func.payable && ' (payable)'}
                        </span>
                      </div>

                      <div className="mb-3">
                        {func.inputs.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Inputs: </span>
                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                              {func.inputs.map((input, i) => `${input.name || `param${i}`}: ${input.type}`).join(', ')}
                            </span>
                          </div>
                        )}
                        {func.outputs.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Returns: </span>
                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                              {func.outputs.map((output, i) => `${output.name || `return${i}`}: ${output.type}`).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                                            {/* Parameters Input */}
                      {(func.stateMutability === 'nonpayable' || func.stateMutability === 'payable') && (
                        <div className="space-y-3 mb-4">
                          {func.inputs.length > 0 ? (
                            <>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Parameters:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {func.inputs.map((input, idx) => (
                                  <div key={idx}>
                                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                      {input.name || `Parameter ${idx + 1}`} ({input.type})
                                    </label>
                                    <input
                                      type="text"
                                      value={funcParams[`param${idx}`] || ''}
                                      onChange={(e) => updateFuncParam(idx, e.target.value)}
                                      placeholder={`Enter ${input.type} value`}
                                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                  </div>
                                ))}
                                <div className="flex items-end">
                                  <button
                                    onClick={handleEstimateForFunction}
                                    disabled={isFuncEstimating || func.inputs.some((_, idx) => !funcParams[`param${idx}`])}
                                    className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isFuncEstimating ? 'Estimating...' : 'Estimate Gas'}
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                No parameters required for this function.
                              </div>
                              <button
                                onClick={handleEstimateForFunction}
                                disabled={isFuncEstimating}
                                className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isFuncEstimating ? 'Estimating...' : 'Estimate Gas'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* View/Pure functions with estimate button */}
                      {(func.stateMutability === 'view' || func.stateMutability === 'pure') && (
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            This is a read-only function. Gas cost is minimal.
                          </div>
                          <button
                            onClick={handleEstimateForFunction}
                            disabled={isFuncEstimating}
                            className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isFuncEstimating ? 'Estimating...' : 'Estimate Gas (Read-only)'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {estimationError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{estimationError}</p>
          </div>
        )}

        {/* Gas Estimation Results Dialog */}
        <GasEstimateDialog
          open={showGasDialog}
          onOpenChange={setShowGasDialog}
          gasEstimate={gasEstimate}
          selectedChain={selectedChain}
        />
      </div>
    </section>
  );
}
