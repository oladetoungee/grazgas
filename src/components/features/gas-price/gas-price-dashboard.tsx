"use client";

import { useState, useEffect } from "react";
import { GasPriceData } from "@/types/gas-price";
import GasPriceHeader from "./live-price";
import ContractInteraction from "./contract-emulator";
import GasPriceTrendChart from "./price-chart";
import GasPumpBanner from "./banner-pump";
import EmbeddableWidget from "./widget";
import TransactionCostsTable from "./table-transaction";

export default function GasPriceDashboard() {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [gasData, setGasData] = useState<GasPriceData | null>(null);
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

  useEffect(() => {
    fetchGasPrices(selectedChain);
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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 py-8">
      <GasPriceHeader 
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        gasData={gasData}
        loading={loading}
        lastUpdate={lastUpdate}
        formatGasPrice={formatGasPrice}
        calculateUSDValue={calculateUSDValue}
      />
      <ContractInteraction />
      <GasPriceTrendChart 
        gasData={gasData}
        loading={loading}
      />
      <GasPumpBanner />
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