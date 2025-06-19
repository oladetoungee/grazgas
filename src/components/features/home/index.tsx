export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
        GrazGas
      </h1>
      <p className="mt-8 text-xs md:text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
        Built at Grazac Academy, GrazGas is a real-time Ethereum gas fee estimator and multi-network tracker with educational insights and embeddable widgets.
      </p>
    </div>
  );
}
