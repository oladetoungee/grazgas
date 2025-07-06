// types.ts

export interface FunctionFragment {
    name: string;
    type: string;
    inputs: Array<{ name: string; type: string; indexed?: boolean | null }>;
    outputs: Array<{ name: string; type: string }>;
    stateMutability: string;
    payable: boolean;
  }
  
  export interface GasEstimate {
    gasUnits: string;
    gasPrice: string;
    totalCost: string;
  }
  