import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

interface CryptoPrice {
  price: number;
  change24h: number;
  prediction: number;
}

export default function PriceWidget() {
  const [data, setData] = useState<CryptoPrice>({
    price: 45123.45,
    change24h: 2.5,
    prediction: 46000.00
  });
  const [loading, setLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setData(prev => ({
        price: prev.price + change,
        change24h: prev.change24h + (Math.random() - 0.5),
        prediction: prev.price + (change * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Market Data</h3>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-3xl font-bold text-primary">{formatPrice(data.price)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">24h Change</p>
                <div className="flex items-center gap-1">
                  {data.change24h > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={data.change24h > 0 ? "text-green-500" : "text-red-500"}>
                    {data.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Prediction</p>
                <p className="font-semibold">{formatPrice(data.prediction)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
