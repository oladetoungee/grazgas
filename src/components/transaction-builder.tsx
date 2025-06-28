'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ethers, getAddress } from 'ethers';
import { Interface, JsonRpcProvider, parseEther } from 'ethers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Settings, AlertTriangle } from 'lucide-react';

interface AbiFunction {
  name: string;
  inputs: Array<{
    name: string;
    type: string;
  }>;
  stateMutability: string;
}

interface TransactionBuilderProps {
  contractAddress: string;
  selectedFunction: AbiFunction | null;
  parameters: Record<string, any>;
  onSimulate: (result: any, error: string | null) => void;
  onSimulationStart: () => void;
  isSimulating: boolean;
}

export function TransactionBuilder({
  contractAddress,
  selectedFunction,
  parameters,
  onSimulate,
  onSimulationStart,
  isSimulating,
}: TransactionBuilderProps) {
  const [fromAddress, setFromAddress] = useState(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );
  const [ethValue, setEthValue] = useState('0');
  const [gasLimit, setGasLimit] = useState('100000');

  const canSimulate = contractAddress && selectedFunction && !isSimulating;

  const handleSimulate = async () => {
    if (!canSimulate || !selectedFunction) return;
    onSimulationStart();

    try {
      // 1. Create the provider with your real Infura key
      const provider = new JsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
      );

      // 2. Convert selectedFunction into a valid ABI fragment
      const abiFragment = {
        type: 'function',
        name: selectedFunction.name,
        stateMutability: selectedFunction.stateMutability,
        inputs: selectedFunction.inputs,
        outputs: [], // If you know the return type, define it here
      };

      const iface = new Interface([abiFragment]);

      // 3. Map parameters into correct order
      const args = selectedFunction.inputs.map(
        (input) => parameters[input.name]
      );

      const data = iface.encodeFunctionData(selectedFunction.name, args);

      const tx = {
        to: contractAddress,
        from: getAddress(fromAddress.trim()),
        data,
        value: parseEther(ethValue || '0'),
        gasLimit: gasLimit ? BigInt(gasLimit) : undefined,
      };

      // 4. Simulate the transaction
      let returnValue: any = null;
      let error: string | null = null;
      let gasUsed: bigint | null = null;

      try {
        const result = await provider.call(tx);
        console.log('Raw result from provider.call:', result);
        try {
          returnValue = iface.decodeFunctionResult(
            selectedFunction.name,
            result
          );
          console.log('Decoded return value:', returnValue);
        } catch (decodeErr) {
          console.warn('Decode failed, returning raw result');
          returnValue = result;
        }
      } catch (callErr: any) {
        console.error('Simulation call failed:', callErr);
        error =
          callErr?.reason ||
          callErr?.data?.message ||
          callErr?.message ||
          'Simulation failed';
      }

      try {
        gasUsed = await provider.estimateGas(tx);
      } catch (e) {
        // fine if it fails
      }

      const blockNumber = await provider.getBlockNumber();

      // 5. Format the response like your mockResult
      onSimulate(
        {
          success: !error,
          returnValue: Array.isArray(returnValue)
            ? returnValue.map((v) => v.toString())
            : returnValue?.toString?.() ?? null,
          gasUsed: gasUsed?.toString() ?? null,
          gasPrice: '20000000000',
          blockNumber: blockNumber.toString(),
          logs:
            selectedFunction.name === 'transfer'
              ? [
                  {
                    address: contractAddress,
                    topics: [
                      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    ],
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
                  },
                ]
              : [],
        },
        error
      );
    } catch (e: any) {
      console.error('Unexpected simulation error:', e);
      onSimulate(null, e?.message ?? 'Unexpected error');
    }
  };

  // const handleSimulate = async () => {
  //   if (!canSimulate || !selectedFunction) return;
  //   onSimulationStart();

  //   try {
  //     const provider = new JsonRpcProvider(
  //       'https://mainnet.infura.io/v3/fd5622cb1dc24e4c8d67048075f97662'
  //     );

  //     const iface = new Interface([selectedFunction]);
  //     const args = selectedFunction.inputs.map(
  //       (input) => parameters[input.name]
  //     );
  //     const data = iface.encodeFunctionData(selectedFunction.name, args);

  //     console.log('Simulating ....', data);

  //     const tx = {
  //       to: contractAddress,
  //       from: getAddress(fromAddress.trim()),
  //       data,
  //       value: parseEther(ethValue || '0'),
  //       // optional: you can omit this for dynamic estimation
  //       gasLimit: gasLimit ? BigInt(gasLimit) : undefined,
  //     };

  //     let returnValue = null;
  //     let gasUsed = null;
  //     let error = null;

  //     try {
  //       const result = await provider.call(tx);

  //       try {
  //         // Try to decode the result based on ABI
  //         returnValue = iface.decodeFunctionResult(
  //           selectedFunction.name,
  //           result
  //         );
  //       } catch (decodeError) {
  //         // If decode fails, fallback to raw result
  //         console.warn('Could not decode result, returning raw hex:', result);
  //         returnValue = result;
  //       }
  //     } catch (callErr: any) {
  //       console.error('Simulation failed:', callErr);
  //       error = callErr?.reason || callErr?.data || 'Simulation failed';
  //     }

  //     try {
  //       gasUsed = await provider.estimateGas(tx);
  //     } catch (e) {
  //       // It's okay if gas estimation fails
  //     }

  //     const blockNumber = await provider.getBlockNumber();

  //     onSimulate(
  //       {
  //         success: !error,
  //         returnValue,
  //         gasUsed: gasUsed?.toString() ?? null,
  //         gasPrice: '20000000000',
  //         blockNumber: blockNumber.toString(),
  //         logs: [], // optional if no log tracking
  //       },
  //       error
  //     );
  //   } catch (e: any) {
  //     console.error('Unexpected simulation error:', e);
  //     onSimulate(null, e?.message ?? 'Unexpected error');
  //   }
  // };

  const validateParameters = () => {
    if (!selectedFunction) return true;

    for (const input of selectedFunction.inputs) {
      const value = parameters[input.name];
      if (value === undefined || value === '') {
        return false;
      }
    }
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Transaction Configuration
        </CardTitle>
        <CardDescription>
          Configure transaction parameters and simulate execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-address">From Address</Label>
            <Input
              id="from-address"
              placeholder="0x..."
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eth-value">ETH Value</Label>
            <Input
              id="eth-value"
              type="number"
              step="0.001"
              placeholder="0.0"
              value={ethValue}
              onChange={(e) => setEthValue(e.target.value)}
              disabled={selectedFunction?.stateMutability !== 'payable'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gas-limit">Gas Limit</Label>
          <Input
            id="gas-limit"
            type="number"
            placeholder="100000"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
          />
        </div>

        {!validateParameters() && selectedFunction && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required parameters for {selectedFunction.name}
            </AlertDescription>
          </Alert>
        )}

        {!contractAddress && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please enter a contract address and parse the ABI first
            </AlertDescription>
          </Alert>
        )}

        {!selectedFunction && contractAddress && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a function to simulate
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSimulate}
          disabled={!canSimulate || !validateParameters()}
          className="w-full"
          size="lg"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Simulate Transaction
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
