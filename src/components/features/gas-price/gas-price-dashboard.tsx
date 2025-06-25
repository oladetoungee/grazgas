"use client";

import GasPriceHeader from "./live-price";
import ContractInteraction from "./contract-emulator";
import GasPriceTrendChart from "./price-chart";
import GasPumpBanner from "./banner-pump";
import EmbeddableWidget from "./widget";
import TransactionCostsTable from "./table-transaction";


export default function GasPriceDashboard() {
 

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 py-8">
      <GasPriceHeader />
      <ContractInteraction />
      <GasPriceTrendChart />
      <GasPumpBanner />
      <EmbeddableWidget />
      <TransactionCostsTable />
    </div>
  );
} 