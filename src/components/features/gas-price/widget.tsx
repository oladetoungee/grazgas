import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GasPriceComponentProps } from "@/types/gas-price";

export default function EmbeddableWidget({ gasData, loading, formatGasPrice, calculateUSDValue }: GasPriceComponentProps) {
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    if (!gasData) {
      return `<iframe src='https://grazgas.com/widget' width='400' height='200'></iframe>`;
    }
    
    const baseFee = formatGasPrice?.(gasData.estimatedBaseFee) || gasData.estimatedBaseFee;
    const lowFee = formatGasPrice?.(gasData.low.suggestedMaxFeePerGas) || gasData.low.suggestedMaxFeePerGas;
    const mediumFee = formatGasPrice?.(gasData.medium.suggestedMaxFeePerGas) || gasData.medium.suggestedMaxFeePerGas;
    const highFee = formatGasPrice?.(gasData.high.suggestedMaxFeePerGas) || gasData.high.suggestedMaxFeePerGas;
    
    return `<iframe src='https://grazgas.com/widget?baseFee=${baseFee}&lowFee=${lowFee}&mediumFee=${mediumFee}&highFee=${highFee}' width='400' height='200'></iframe>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Embeddable Widget</h2>
      {loading ? (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Skeleton className="h-4 w-64" />
        </div>
      ) : gasData && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>Live Data:</strong> Base Fee: {formatGasPrice?.(gasData.estimatedBaseFee) || gasData.estimatedBaseFee} Gwei, 
            Low: {formatGasPrice?.(gasData.low.suggestedMaxFeePerGas) || gasData.low.suggestedMaxFeePerGas} Gwei
          </div>
        </div>
      )}
      <pre className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm select-all">
        <code>{generateEmbedCode()}</code>
      </pre>
      <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
        {copied ? "Copied!" : "Copy Embed Code"}
      </button>
    </section>
  );
} 