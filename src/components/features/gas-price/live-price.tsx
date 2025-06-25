import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type GasPriceCardProps = {
  label: string;
  value: string;
  unit?: string;
  usd?: string;
  colorClass?: string;
};

function GasPriceCard({ label, value, unit = "Gwei", usd, colorClass = "" }: GasPriceCardProps) {
  return (
    <div className="w-full md:flex-1">
      <Card className="text-center">
        <CardHeader>
          <div className="text-base font-medium mb-2">{label}</div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${colorClass}`}>{value} <span className="text-base font-normal">{unit}</span></div>
          {usd && <div className={colorClass}>{usd}</div>}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GasPriceHeader() {
  return (
    <section className="mt-12 mx-8">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-2xl font-bold">Live Gas Prices</h2>
        <div className="w-48">
          <Select defaultValue="ethereum">
            <SelectTrigger>
              <SelectValue placeholder="Ethereum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-2">
        <GasPriceCard label="Base Fee" value="10" usd="$0.28" colorClass="text-amber-600" />
        <GasPriceCard label="Low" value="12" usd="($0.34)" colorClass="text-green-600" />
        <GasPriceCard label="Medium" value="18" usd="($0.49)" colorClass="text-blue-600" />
        <GasPriceCard label="High" value="25" usd="($0.67)" colorClass="text-red-600" />
      </div>
      <div className="text-xs text-gray-500 mt-8">Last Update: Just now</div>
    </section>
  );
} 