import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TransactionCostsTable() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-2">Transaction Costs <span className="text-xs font-normal text-foreground">Updated 14:02:15 UTC</span></h2>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-4 py-2 text-left font-semibold">Transaction</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">Gwei</TableHead>
              <TableHead className="px-4 py-2 text-left font-semibold">USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-gray-50 dark:bg-gray-400">
              <TableCell className="px-4 py-2">ETH Transfer</TableCell>
              <TableCell className="px-4 py-2">21,000</TableCell>
              <TableCell className="px-4 py-2">$0.20</TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 dark:bg-gray-400">
              <TableCell className="px-4 py-2">ERC20 Approval</TableCell>
              <TableCell className="px-4 py-2">45,000</TableCell>
              <TableCell className="px-4 py-2">$0.44</TableCell>
            </TableRow>
            <TableRow className="bg-gray-50 dark:bg-gray-400">
              <TableCell className="px-4 py-2">ERC20 Token Transfer</TableCell>
              <TableCell className="px-4 py-2">65,000</TableCell>
              <TableCell className="px-4 py-2">$0.63</TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </div>
    </section>
  );
} 