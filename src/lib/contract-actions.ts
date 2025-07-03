import { ethers } from "ethers";
import { FunctionFragment, GasEstimate } from "@/types/contract";

export const processAbi = async (
  contractAddress: string,
  abiInput: string,
  setCallableFunctions: React.Dispatch<React.SetStateAction<FunctionFragment[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!contractAddress.trim() || !abiInput.trim()) return setCallableFunctions([]);
  setIsLoading(true);
  setError(null);

  try {
    if (!ethers.isAddress(contractAddress.trim())) throw new Error("Invalid contract address");
    const parsedAbi = JSON.parse(abiInput.trim());

    if (!Array.isArray(parsedAbi)) throw new Error("ABI must be an array");
    
    const contractInterface = new ethers.Interface(parsedAbi);
    const functions = contractInterface.fragments.filter((fragment) => fragment.type === "function").map((fragment) => {
      const func = fragment as ethers.FunctionFragment;
      return {
        ...func,
        inputs: func.inputs.map((input) => ({ name: input.name || "", type: input.type, indexed: input.indexed })),
        outputs: func.outputs.map((output) => ({ name: output.name || "", type: output.type })),
      };
    });

    setCallableFunctions(functions);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
    setCallableFunctions([]);
  } finally {
    setIsLoading(false);
  }
};

// More reliable RPC endpoints
const RPC_ENDPOINTS = {
  ethereum: "https://rpc.ankr.com/eth",
  polygon: "https://rpc.ankr.com/polygon",
  bsc: "https://rpc.ankr.com/bsc",
  arbitrum: "https://rpc.ankr.com/arbitrum",
  optimism: "https://rpc.ankr.com/optimism",
};

// Fallback RPC endpoints in case primary ones fail
const FALLBACK_RPC_ENDPOINTS = {
  ethereum: "https://ethereum.publicnode.com",
  polygon: "https://polygon.publicnode.com",
  bsc: "https://bsc.publicnode.com",
  arbitrum: "https://arbitrum.publicnode.com",
  optimism: "https://optimism.publicnode.com",
};

// Fallback gas prices (in gwei) for different chains
const FALLBACK_GAS_PRICES = {
  ethereum: "20",
  polygon: "30",
  bsc: "5",
  arbitrum: "0.1",
  optimism: "0.001"
};

const createProvider = async (chain: string): Promise<ethers.Provider> => {
  const primaryEndpoint = RPC_ENDPOINTS[chain as keyof typeof RPC_ENDPOINTS];
  const fallbackEndpoint = FALLBACK_RPC_ENDPOINTS[chain as keyof typeof FALLBACK_RPC_ENDPOINTS];
  
  if (!primaryEndpoint) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  try {
    // Try primary endpoint first
    const provider = new ethers.JsonRpcProvider(primaryEndpoint);
    // Test the connection
    await provider.getNetwork();
    return provider;
  } catch (error) {
    console.warn(`Primary RPC endpoint failed for ${chain}, trying fallback...`);
    
    try {
      const fallbackProvider = new ethers.JsonRpcProvider(fallbackEndpoint);
      await fallbackProvider.getNetwork();
      return fallbackProvider;
    } catch (fallbackError) {
      throw new Error(`Failed to connect to ${chain} network. Please try again later.`);
    }
  }
};

export const estimateGas = async (
  selectedFunction: FunctionFragment,
  contractAddress: string,
  abiInput: string,
  functionParams: Record<string, string>,
  chain: string,
  onSuccess: (result: GasEstimate) => void,
  setEstimationError: React.Dispatch<React.SetStateAction<string | null>>,
  setIsEstimating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!contractAddress.trim() || !abiInput.trim()) return;

  setIsEstimating(true);
  setEstimationError(null);

  try {
    // Create provider with fallback logic
    const provider = await createProvider(chain);
    
    // Validate contract address format
    if (!ethers.isAddress(contractAddress.trim())) {
      throw new Error("Invalid contract address format");
    }
    
    // Parse and validate ABI
    let parsedAbi;
    try {
      parsedAbi = JSON.parse(abiInput.trim());
      if (!Array.isArray(parsedAbi)) {
        throw new Error("ABI must be an array");
      }
    } catch (parseError) {
      throw new Error("Invalid ABI JSON format");
    }
    
    const contract = new ethers.Contract(contractAddress.trim(), parsedAbi, provider);
    
    let gasEstimateResult;
    
    if (selectedFunction.inputs.length > 0) {
      const params = selectedFunction.inputs.map((input, index) => {
        const value = functionParams[`param${index}`];
        if (!value) throw new Error(`Parameter ${input.name || `param${index}`} is required`);
        return input.type === 'uint256' || input.type === 'uint' ? ethers.parseUnits(value, 0) : value;
      });
      gasEstimateResult = await contract[selectedFunction.name].estimateGas(...params);
    } else {
      gasEstimateResult = await contract[selectedFunction.name].estimateGas();
    }
    
    // Get current gas price from provider with fallback
    let currentGasPrice;
    try {
      const gasPrice = await provider.getFeeData();
      currentGasPrice = gasPrice.gasPrice || ethers.parseUnits(FALLBACK_GAS_PRICES[chain as keyof typeof FALLBACK_GAS_PRICES] || "20", "gwei");
    } catch (gasError) {
      console.warn('Failed to get gas price from provider, using fallback:', gasError);
      const fallbackPrice = FALLBACK_GAS_PRICES[chain as keyof typeof FALLBACK_GAS_PRICES] || "20";
      currentGasPrice = ethers.parseUnits(fallbackPrice, "gwei");
    }
    
    const totalCost = gasEstimateResult * currentGasPrice;

    const result = {
      gasUnits: gasEstimateResult.toString(),
      gasPrice: ethers.formatUnits(currentGasPrice, "gwei"),
      totalCost: ethers.formatEther(totalCost),
    };
    
    onSuccess(result);
  } catch (err) {
    setEstimationError(err instanceof Error ? err.message : "Gas estimation failed");
  } finally {
    setIsEstimating(false);
  }
};
