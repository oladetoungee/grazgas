import { useState } from "react";
import { Button } from "@/components/ui/button";

const EMBED_CODE = `<iframe src='https://grazgas.com/widget' width='400' height='200'></iframe>`;

export default function EmbeddableWidget() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Embeddable Widget</h2>
      <pre className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto text-sm select-all">
        <code>{EMBED_CODE}</code>
      </pre>
      <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
        {copied ? "Copied!" : "Copy Embed Code"}
      </button>
    </section>
  );
} 