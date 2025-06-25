import Image from "next/image";

export default function GasPumpBanner() {
  return (
    <section className="mb-8">
      <div className="w-full rounded-lg overflow-hidden">
        <Image src="/gas-pump2.png" alt="Gas Pump" width={400} height={100} className="w-full object-cover" />
      </div>
    </section>
  );
} 