import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WalletManager } from "@/components/wallet/WalletManager";
import { Wallet, ArrowUpRight, ArrowDownLeft, Repeat, PieChart } from "lucide-react";

export default function WalletPage() {
  const walletStats = {
    balance: "15,234.56 NC",
    totalStaked: "5,000 NC",
    rewardsPending: "234.12 NC",
    lastTransaction: "2 hours ago"
  };

  const recentTransactions = [
    {
      type: "Received",
      amount: "+1,234.56 NC",
      from: "Mining Rewards",
      time: "2 hours ago",
      status: "Completed"
    },
    {
      type: "Sent",
      amount: "-500 NC",
      to: "Validator Pool",
      time: "1 day ago",
      status: "Completed"
    },
    {
      type: "Staked",
      amount: "-2,000 NC",
      to: "Staking Pool",
      time: "3 days ago",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Neura Wallet</h1>
        <p className="text-muted-foreground">Manage your NeuraCoin assets securely</p>
      </div>

      {/* Wallet Manager Component */}
      <WalletManager />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{walletStats.balance}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staked</p>
                <p className="text-2xl font-bold">{walletStats.totalStaked}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <PieChart className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
                <p className="text-2xl font-bold">{walletStats.rewardsPending}</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <Repeat className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Transaction History (Show only when wallet is connected) */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Connect or create a wallet to view your transaction history
          </div>
        </CardContent>
      </Card>
    </div>
  );
}