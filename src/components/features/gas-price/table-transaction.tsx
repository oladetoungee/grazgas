import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { GasPriceComponentProps } from "@/types/gas-price";
import { TRANSACTION_TYPES } from "@/data/transaction";


export default function TransactionCostsTable({ gasData, loading, formatGasPrice, calculateUSDValue }: GasPriceComponentProps) {
  const calculateTransactionCost = (gasLimit: number, gasPrice: string) => {
    const limit = gasLimit;
    const price = parseFloat(gasPrice);
    const totalGwei = limit * price;
    const totalEth = totalGwei / 1e9; // Convert Gwei to ETH
    const usdValue = totalEth * 2000; // Rough ETH price estimation
    return {
      gwei: totalGwei.toFixed(0),
      usd: `$${usdValue.toFixed(2)}`
    };
  };

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <div className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!gasData) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Transaction Costs</h2>
        <div className="text-center text-gray-500 py-8">No gas price data available</div>
      </section>
    );
  }

  return (
    <section className="mb-8 mx-8">
      <h2 className="text-2xl font-bold mb-2">
        Transaction Costs 
        <span className="text-xs font-normal text-foreground ml-2">
          Updated {new Date().toLocaleTimeString()} UTC
        </span>
      </h2>
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-full text-sm">
          <TableHeader >
            <TableRow className="bg-gray-50">
              <TableHead className="px-4 py-2 text-left font-semibold">Transaction</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">Gas Limit</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">Low Priority</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">Medium Priority</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">High Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(TRANSACTION_TYPES).map(([transaction, gasLimit]) => {
              const lowCost = calculateTransactionCost(gasLimit, gasData.low.suggestedMaxFeePerGas);
              const mediumCost = calculateTransactionCost(gasLimit, gasData.medium.suggestedMaxFeePerGas);
              const highCost = calculateTransactionCost(gasLimit, gasData.high.suggestedMaxFeePerGas);
              
              return (
                <TableRow key={transaction} className="bg-gray-50 dark:bg-gray-700">
                  <TableCell className="px-4 py-2 font-medium">{transaction}</TableCell>
                  <TableCell className="px-4 py-2">{gasLimit.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="text-green-600">{lowCost.gwei} Gwei</div>
                    <div className="text-xs text-gray-500">{lowCost.usd}</div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="text-blue-600">{mediumCost.gwei} Gwei</div>
                    <div className="text-xs text-gray-500">{mediumCost.usd}</div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="text-red-600">{highCost.gwei} Gwei</div>
                    <div className="text-xs text-gray-500">{highCost.usd}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
} 