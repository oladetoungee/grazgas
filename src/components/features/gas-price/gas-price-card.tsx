"use client";

import { GasPrice } from "@/lib/gas-service";
import { Clock, Zap, Shield, Rocket } from "lucide-react";

interface GasPriceCardProps {
  gasPrice: GasPrice;
}

export function GasPriceCard({ gasPrice }: GasPriceCardProps) {
  const formatGasPrice = (price: string) => {
    const num = parseFloat(price);
    if (num < 1) return num.toFixed(2);
    if (num < 10) return num.toFixed(1);
    return Math.round(num).toString();
  };

  const getGasSpeedColor = (speed: string) => {
    switch (speed) {
      case 'safe':
        return 'text-green-600 dark:text-green-400';
      case 'standard':
        return 'text-blue-600 dark:text-blue-400';
      case 'fast':
        return 'text-orange-600 dark:text-orange-400';
      case 'rapid':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getGasSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'safe':
        return <Shield className="h-4 w-4" />;
      case 'standard':
        return <Clock className="h-4 w-4" />;
      case 'fast':
        return <Zap className="h-4 w-4" />;
      case 'rapid':
        return <Rocket className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {gasPrice.network}
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(gasPrice.timestamp).toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          {getGasSpeedIcon('safe')}
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Safe</div>
            <div className={`font-bold ${getGasSpeedColor('safe')}`}>
              {formatGasPrice(gasPrice.safe)} Gwei
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getGasSpeedIcon('standard')}
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Standard</div>
            <div className={`font-bold ${getGasSpeedColor('standard')}`}>
              {formatGasPrice(gasPrice.standard)} Gwei
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getGasSpeedIcon('fast')}
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fast</div>
            <div className={`font-bold ${getGasSpeedColor('fast')}`}>
              {formatGasPrice(gasPrice.fast)} Gwei
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getGasSpeedIcon('rapid')}
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rapid</div>
            <div className={`font-bold ${getGasSpeedColor('rapid')}`}>
              {formatGasPrice(gasPrice.rapid)} Gwei
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 