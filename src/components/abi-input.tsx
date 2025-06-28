'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, ExternalLink, AlertCircle } from 'lucide-react';

interface AbiInputProps {
  onAbiChange: (abi: any[], contractAddress: string) => void;
  contractAddress: string;
}

// 'https://mainnet.infura.io/v3/fd5622cb1dc24e4c8d67048075f97662'

export function AbiInput({ onAbiChange, contractAddress }: AbiInputProps) {
  const [abiText, setAbiText] = useState('');
  const [address, setAddress] = useState(contractAddress);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAbiSubmit = () => {
    try {
      setError('');
      if (!abiText.trim()) {
        setError('Please enter an ABI');
        return;
      }
      if (!address.trim()) {
        setError('Please enter a contract address');
        return;
      }

      const parsedAbi = JSON.parse(abiText);
      if (!Array.isArray(parsedAbi)) {
        setError('ABI must be an array');
        return;
      }

      const functions = parsedAbi.filter((item) => item.type === 'function');
      if (functions.length === 0) {
        setError('No functions found in ABI');
        return;
      }

      onAbiChange(functions, address);
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const fetchFromEtherscan = async () => {
    if (!address.trim()) {
      setError('Please enter a contract address first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // This would normally call Etherscan API
      // For demo purposes, we'll show how it would work
      setError('Etherscan integration would be implemented here with API key');
    } catch (e) {
      setError('Failed to fetch ABI from Etherscan');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleAbi = () => {
    const sampleAbi = [
      {
        name: 'transfer',
        type: 'function',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
      },
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
      },
      {
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
      },
    ];

    setAbiText(JSON.stringify(sampleAbi, null, 2));
    setAddress('0xA0b86a33E6441b8435b662f98137B4B9c7C8E4B1'); // Sample ERC20 address
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contract-address">Contract Address</Label>
        <div className="flex gap-2">
          <Input
            id="contract-address"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="font-mono text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFromEtherscan}
            disabled={isLoading}
            className="shrink-0"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Etherscan
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="abi-input">Contract ABI</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSampleAbi}
            className="text-xs"
          >
            Load Sample ERC20
          </Button>
        </div>
        <Textarea
          id="abi-input"
          placeholder="Paste your contract ABI JSON here..."
          value={abiText}
          onChange={(e) => setAbiText(e.target.value)}
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleAbiSubmit} className="w-full">
        <Upload className="w-4 h-4 mr-2" />
        Parse ABI
      </Button>
    </div>
  );
}
