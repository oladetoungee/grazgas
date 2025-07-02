'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GasPriceData } from '@/types/gas-price';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const WidgetPage = () => {
  const searchParams = useSearchParams();
  const [gasData, setGasData] = useState<GasPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get chainId from URL params, default to ethereum
  const chainId = searchParams.get('chainId') || 'ethereum';
  const [selectedChain, setSelectedChain] = useState(chainId);

  const formatGasPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
  };

  const calculateUSDValue = (gweiPrice: string) => {
    const gwei = parseFloat(gweiPrice);
    const usdValue = gwei * 0.000001;
    return `$${usdValue.toFixed(4)}`;
  };

  const getCongestionLevel = (congestion: number) => {
    if (congestion < 0.3) return 'Low';
    if (congestion < 0.7) return 'Medium';
    return 'High';
  };

  const fetchGasPrices = async (chain: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/gas-price?chain=${chain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gas prices');
      }
      const data = await response.json();
      setGasData(data);
    } catch (error) {
      console.error('Error fetching gas prices:', error);
      setError('Failed to load gas price data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasPrices(selectedChain);
  }, [selectedChain]);

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-600 to-gray-100 border border-gray-200 rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-600 to-gray-100 border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center text-gray-600">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gasData) {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-600 to-gray-100 border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center text-gray-500">
            <p>No gas price data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <div className="bg-gradient-to-br from-slate-400 to-gray-100 border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Gas Prices
            </h2>
            <span className="text-xs text-gray-500">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="w-full">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full bg-black">
                <SelectValue placeholder="Select Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum (Mainnet)</SelectItem>
                <SelectItem value="base">Base (Mainnet)</SelectItem>
                <SelectItem value="arbitrum">Arbitrum (Mainnet)</SelectItem>
                <SelectItem value="optimism">Optimism (Mainnet)</SelectItem>
                <SelectItem value="polygon">Polygon (Mainnet)</SelectItem>
                <SelectItem value="scroll">Scroll (Mainnet)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gas Price Data */}
        <div className="p-6 space-y-4">
          {/* Base Fee */}
          <div className="flex justify-between items-center py-3 px-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div>
              <span className="text-sm font-medium text-gray-700">Base Fee</span>
              <div className="text-xs text-gray-500">Network base fee</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatGasPrice(gasData.estimatedBaseFee)}
              </div>
              <div className="text-xs text-gray-500">
                {calculateUSDValue(gasData.estimatedBaseFee)}
              </div>
            </div>
          </div>

          {/* Low Priority */}
          <div className="flex justify-between items-center py-3 px-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div>
              <span className="text-sm font-medium text-gray-700">Low Priority</span>
              <div className="text-xs text-gray-500">Slow transactions</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatGasPrice(gasData.low.suggestedMaxFeePerGas)}
              </div>
              <div className="text-xs text-gray-500">
                {calculateUSDValue(gasData.low.suggestedMaxFeePerGas)}
              </div>
            </div>
          </div>

          {/* Medium Priority */}
          <div className="flex justify-between items-center py-3 px-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div>
              <span className="text-sm font-medium text-gray-700">Medium Priority</span>
              <div className="text-xs text-gray-500">Standard transactions</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatGasPrice(gasData.medium.suggestedMaxFeePerGas)}
              </div>
              <div className="text-xs text-gray-500">
                {calculateUSDValue(gasData.medium.suggestedMaxFeePerGas)}
              </div>
            </div>
          </div>

          {/* High Priority */}
          <div className="flex justify-between items-center py-3 px-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div>
              <span className="text-sm font-medium text-gray-700">High Priority</span>
              <div className="text-xs text-gray-500">Fast transactions</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {formatGasPrice(gasData.high.suggestedMaxFeePerGas)}
              </div>
              <div className="text-xs text-gray-500">
                {calculateUSDValue(gasData.high.suggestedMaxFeePerGas)}
              </div>
            </div>
          </div>

          {/* Network Congestion */}
          <div className="flex justify-between items-center py-3 px-4 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div>
              <span className="text-sm font-medium text-gray-700">Network Congestion</span>
              <div className="text-xs text-gray-500">Current network load</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(gasData.networkCongestion * 100)}%
              </div>
              <div className="text-xs text-gray-500">
                {getCongestionLevel(gasData.networkCongestion)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/50 backdrop-blur-sm border-t border-gray-200 rounded-b-lg">
          <div className="text-center">
            <a 
              href="https://grazgas.vercel.app/" 
              target="_parent" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              Powered by GrazGas
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetPage;
