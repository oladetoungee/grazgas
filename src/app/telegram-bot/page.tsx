import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function TelegramBotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-grazgas-blue rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-500">
            Telegram Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-500">
              🚧 Coming Soon
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We're currently building an amazing Telegram bot that will provide real-time gas price alerts, 
              transaction cost estimates, and smart notifications to help you optimize your Ethereum transactions.
            </p>
          </div>
          
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">✨ Planned Features</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Real-time gas price alerts</li>
              <li>• Transaction cost estimates</li>
              <li>• Multi-chain support</li>
              <li>• Custom notification settings</li>
              <li>• Historical price trends</li>
            </ul>
          </div> */}

          <div className="pt-4">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500">
            Follow us on <a href="https://discord.gg/Urj6n7Aj" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Discord</a> for updates!
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 