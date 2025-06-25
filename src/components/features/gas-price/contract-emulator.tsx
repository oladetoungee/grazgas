export default function ContractInteraction() {
  return (
    <section className="mt-6 mx-8">
      <h2 className="text-lg font-semibold mb-2">Contract Interaction</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter Contract Address"
          className="flex-1 border rounded-lg px-4 py-2 text-base"
        />
        <button className="bg-grazgas-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-grazgas-blue/80 transition-colors">Simulate & Estimate Gas</button>
      </div>
    </section>
  );
} 