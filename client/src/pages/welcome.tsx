import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Network, Activity } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Optimized background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-primary/10 animate-gradient-shift will-change-[background-position]" />

      {/* Reduced number of floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/5 animate-float will-change-transform"
            style={{
              width: `${Math.random() * 150 + 100}px`,
              height: `${Math.random() * 150 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse will-change-opacity" />
              <Brain className="h-24 w-24 text-primary animate-float z-10 will-change-transform" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold animate-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
              Welcome to NeuraCoin
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in">
              Where Neural Networks Meet Digital Value
            </p>
          </div>

          <Card className="p-6 backdrop-blur-sm bg-background/95 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: Network,
                    title: "Decentralized Network",
                    description: "Powered by collective intelligence"
                  },
                  {
                    icon: Brain,
                    title: "Neural Mining",
                    description: "Learn, engage, and earn rewards"
                  },
                  {
                    icon: Activity,
                    title: "Active Community",
                    description: "Join a growing ecosystem"
                  }
                ].map((feature, index) => (
                  <div key={index} className="text-center space-y-2 group hover:scale-105 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full text-lg py-6 hover:border-primary hover:text-primary transition-colors duration-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity duration-300">
                    Join the Network
                  </Button>
                </Link>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid gap-3 mt-6">
                {["Google", "Email", "Phone"].map((method) => (
                  <Button
                    key={method}
                    variant="outline"
                    className="w-full text-lg py-6 hover:bg-primary/5 transition-colors duration-300"
                  >
                    Continue with {method}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <p className="text-sm text-muted-foreground animate-fade-in">
            Join thousands of users in the future of decentralized neural networks
          </p>
        </div>
      </div>
    </div>
  );
}