export type GasPriceData = {
  low: {
    suggestedMaxPriorityFeePerGas: string;
    suggestedMaxFeePerGas: string;
    minWaitTimeEstimate: number;
    maxWaitTimeEstimate: number;
  };
  medium: {
    suggestedMaxPriorityFeePerGas: string;
    suggestedMaxFeePerGas: string;
    minWaitTimeEstimate: number;
    maxWaitTimeEstimate: number;
  };
  high: {
    suggestedMaxPriorityFeePerGas: string;
    suggestedMaxFeePerGas: string;
    minWaitTimeEstimate: number;
    maxWaitTimeEstimate: number;
  };
  estimatedBaseFee: string;
  networkCongestion: number;
  latestPriorityFeeRange: string[];
  historicalPriorityFeeRange: string[];
  historicalBaseFeeRange: string[];
  priorityFeeTrend: string;
  baseFeeTrend: string;
  version: string;
};

export type HistoricalGasData = {
  date: string;
  baseFee: string;
  low: string;
  medium: string;
  high: string;
}[];

export type GasPriceComponentProps = {
  gasData: GasPriceData | null;
  loading: boolean;
  formatGasPrice?: (price: string) => string;
  calculateUSDValue?: (gweiPrice: string) => string;
};

export type GasPriceChartProps = GasPriceComponentProps & {
  historicalData: HistoricalGasData | null;
  selectedChain: string;
  onRangeChange: (range: string) => void;
}; 