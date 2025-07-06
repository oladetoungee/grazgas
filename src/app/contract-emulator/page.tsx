import ContractInteraction from "@/components/features/gas-price/contract-emulator";

export default function ContractEmulatorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Contract Gas Estimator
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estimate gas costs for any Ethereum smart contract function. Input your contract address and ABI to analyze gas consumption and optimize your transactions.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <ContractInteraction />
        </div>
      </div>
    </div>
  );
} 