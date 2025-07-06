

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GasEstimate } from "@/types/contract";

interface GasEstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gasEstimate: GasEstimate | null;
  selectedChain: string;
}

export default function GasEstimateDialog({
  open,
  onOpenChange,
  gasEstimate,
  selectedChain,
}: GasEstimateDialogProps) {
  const getNativeToken = (chain: string) => {
    switch (chain) {
      case 'ethereum':
        return 'ETH';
      case 'polygon':
        return 'MATIC';
      case 'bsc':
        return 'BNB';
      case 'arbitrum':
      case 'optimism':
        return 'ETH';
      default:
        return 'ETH';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Gas Estimation Results</DialogTitle>
        </DialogHeader>
        {gasEstimate && (
          <div className="space-y-4">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200 capitalize">
                {selectedChain} Network
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{gasEstimate.gasUnits}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Gas Units</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{gasEstimate.gasPrice}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Gwei</div>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-800 dark:text-green-300">{gasEstimate.totalCost}</div>
              <div className="text-sm text-green-700 dark:text-green-400">
                Total Cost ({getNativeToken(selectedChain)})
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 