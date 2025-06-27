"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { GasPriceData } from "@/types/gas-price";

type GasPriceCardProps = {
  label: string;
  value: string;
  unit?: string;
  usd?: string;
  colorClass?: string;
};

type GasPriceHeaderProps = {
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
  gasData: GasPriceData | null;
  loading: boolean;
  lastUpdate: Date | null;
  formatGasPrice: (price: string) => string;
  calculateUSDValue: (gweiPrice: string) => string;
};

function GasPriceCard({ label, value, unit = "Gwei", usd, colorClass = "" }: GasPriceCardProps) {
  return (
    <div className="w-full md:flex-1">
      <Card className="text-center">
        <CardHeader>
          <div className="text-base font-medium mb-2">{label}</div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${colorClass}`}>{value} <span className="text-base font-normal">{unit}</span></div>
          {usd && <div className={colorClass}>{usd}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

function GasPriceCardSkeleton() {
  return (
    <div className="w-full md:flex-1">
      <Card className="text-center">
        <CardHeader>
          <Skeleton className="h-4 w-20 mx-auto" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-12 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function GasPriceHeader({
  selectedChain,
  setSelectedChain,
  gasData,
  loading,
  lastUpdate,
  formatGasPrice,
  calculateUSDValue
}: GasPriceHeaderProps) {
  return (
    <section className="mt-12 mx-8">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold">Live Gas Prices</h2>
        <div className="w-48">
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger>
              <SelectValue placeholder="Ethereum" />
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
      
      {loading ? (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2">
          <GasPriceCardSkeleton />
          <GasPriceCardSkeleton />
          <GasPriceCardSkeleton />
          <GasPriceCardSkeleton />
        </div>
      ) : gasData ? (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2">
          <GasPriceCard 
            label="Base Fee" 
            value={formatGasPrice(gasData.estimatedBaseFee)} 
            usd={calculateUSDValue(gasData.estimatedBaseFee)} 
            colorClass="text-amber-600" 
          />
          <GasPriceCard 
            label="Low" 
            value={formatGasPrice(gasData.low.suggestedMaxFeePerGas)} 
            usd={calculateUSDValue(gasData.low.suggestedMaxFeePerGas)} 
            colorClass="text-green-600" 
          />
          <GasPriceCard 
            label="Medium" 
            value={formatGasPrice(gasData.medium.suggestedMaxFeePerGas)} 
            usd={calculateUSDValue(gasData.medium.suggestedMaxFeePerGas)} 
            colorClass="text-blue-600" 
          />
          <GasPriceCard 
            label="High" 
            value={formatGasPrice(gasData.high.suggestedMaxFeePerGas)} 
            usd={calculateUSDValue(gasData.high.suggestedMaxFeePerGas)} 
            colorClass="text-red-600" 
          />
        </div>
      ) : (
        <div className="text-center text-red-500">Failed to load gas prices</div>
      )}
      
      <div className="text-xs text-gray-500 mt-8">
        Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
      </div>
    </section>
  );
} 