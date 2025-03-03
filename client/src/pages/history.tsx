import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function History() {
  const transactions = [
    {
      type: "Mining Reward",
      amount: "+120.45 NC",
      date: "March 1, 2025",
      time: "10:23 AM",
      status: "Completed",
      hash: "0x1234...5678"
    },
    {
      type: "Staking Reward",
      amount: "+45.32 NC",
      date: "February 28, 2025",
      time: "11:45 PM",
      status: "Completed",
      hash: "0x8765...4321"
    },
    {
      type: "Transfer",
      amount: "-500.00 NC",
      date: "February 27, 2025",
      time: "3:15 PM",
      status: "Completed",
      hash: "0x9876...5432"
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">View all your network transactions</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.amount.startsWith("+")
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {transaction.amount.startsWith("+") ? (
                      <ArrowDownLeft
                        className={`h-4 w-4 ${
                          transaction.amount.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.type}</p>
                      <p
                        className={`text-sm ${
                          transaction.amount.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.amount}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hash: {transaction.hash}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{transaction.date}</p>
                  <p className="text-sm text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
