"use client";

export default function Instructions() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to use:</h3>
      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <li>1. Select the network you want to simulate on</li>
        <li>2. Enter a valid contract address for that network</li>
        <li>3. Paste the contract ABI (JSON format)</li>
        <li>4. Select a function and input parameters</li>
        <li>5. Get accurate gas estimates with real-time gas prices</li>
      </ol>
    </div>
  );
} 