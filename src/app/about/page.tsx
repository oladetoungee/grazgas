import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-[80vh] w-full flex flex-col items-center justify-center px-8  py-18">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Heading and Image */}
        <div>
          <h1 className="text-5xl md:text-6xl mb-8 leading-tight">
            About
            <span className="block mt-2">GrazGas</span>
          </h1>
          <div className="w-full aspect-square relative overflow-hidden shadow-lg">
            <Image src="/gas-pump.png" alt="Gas Pumping" fill className="object-cover" />
          </div>
        </div>
        {/* Right: Description and Features */}
        <div className="flex flex-col gap-6 text-sm md:text-base text-gray-700 dark:text-white">
          <p>
            GrazGas is a lightweight, open-source Ethereum gas tracker and fee estimation tool built for the Web3 ecosystem. Whether you're a developer, crypto enthusiast, or dApp user, GrazGas helps you make smarter, faster, and more cost-effective transaction decisions.
          </p>
          <div>
            <span className="font-semibold">We provide:</span>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-base">
              <li><span className="font-semibold">Real-time gas fee data</span> across Ethereum and Layer 2 networks like Arbitrum, Optimism, Base, and Polygon.</li>
              <li><span className="font-semibold">Visual trends and comparisons</span> to help you choose the most affordable and efficient network.</li>
              <li><span className="font-semibold">An embeddable widget</span> for developers to easily integrate gas insights into dApps, wallets, and dashboards.</li>
              <li><span className="font-semibold">Educational insights</span> to demystify how gas works and how to optimize fees.</li>
            </ul>
          </div>
          <p>
            At GrazGas, our mission is to make blockchain transactions more transparent and accessible — one gas unit at a time.
          </p>
        </div>
      </div>
    </main>
  );
} 