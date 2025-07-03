"use client";

import { useState, useEffect } from "react";
import { GasPriceData, HistoricalGasData } from "@/types/gas-price";
import GasPriceHeader from "./live-price";
import GasPriceTrendChart from "./price-chart";
import EmbeddableWidget from "./widget";
import TransactionCostsTable from "./table-transaction";

export default function GasPriceDashboard() {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [gasData, setGasData] = useState<GasPriceData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalGasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchGasPrices = async (chain: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gas-price?chain=${chain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch gas prices');
      }
      const data = await response.json();
      setGasData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching gas prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async (chain: string, range: string) => {
    try {
      const response = await fetch(`/api/gas-price/history?chain=${chain}&range=${range}`);
      if (response.ok) {
        const data = await response.json();
        setHistoricalData(data);
      } else {
        console.warn('Historical data not available, using simulated data');
        setHistoricalData(null);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setHistoricalData(null);
    }
  };

  useEffect(() => {
    fetchGasPrices(selectedChain);
    fetchHistoricalData(selectedChain, '24h');
  }, [selectedChain]);

  const formatGasPrice = (price: string) => {
    return parseFloat(price).toFixed(2);
  };

  const calculateUSDValue = (gweiPrice: string) => {
    const gwei = parseFloat(gweiPrice);
    const usdValue = gwei * 0.000001;
    return `$${usdValue.toFixed(4)}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 py-8 mx-8">
      <GasPriceHeader 
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        gasData={gasData}
        loading={loading}
        lastUpdate={lastUpdate}
        formatGasPrice={formatGasPrice}
        calculateUSDValue={calculateUSDValue}
      />
      
      {/* Contract Emulator CTA */}
      <div className="mx-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Estimate Your Contract Gas Costs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Input any smart contract address and ABI to get precise gas estimates for all functions. Perfect for developers and DeFi users.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="/contract-emulator"
              className="inline-flex items-center px-6 py-3 bg-grazgas-blue text-white font-semibold rounded-lg hover:bg-grazgas-blue/80 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Try Contract Estimator
            </a>
          </div>
        </div>
      </div>
      
      <GasPriceTrendChart 
        gasData={gasData}
        historicalData={historicalData}
        loading={loading}
        selectedChain={selectedChain}
        onRangeChange={(range: string) => fetchHistoricalData(selectedChain, range)}
      />
      <EmbeddableWidget 
        gasData={gasData}
        loading={loading}
        formatGasPrice={formatGasPrice}
        calculateUSDValue={calculateUSDValue}
      />
      <TransactionCostsTable 
        gasData={gasData}
        loading={loading}
        formatGasPrice={formatGasPrice}
        calculateUSDValue={calculateUSDValue}
      />
    </div>
  );
} 