import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkedinIcon, TwitterIcon, GlobeIcon } from "lucide-react";

export default function CoreTeam() {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Neura Core Team</h1>
        <p className="text-muted-foreground">Meet the visionaries behind Neura Network</p>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5">
          {/* Neural Network Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 p-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    transform: `scale(${1 + Math.sin(i * 0.5) * 0.5})`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Animated Neural Connections */}
          <div className="absolute inset-0">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
                  <animate attributeName="x1" from="0%" to="100%" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="x2" from="100%" to="200%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
              </defs>
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 30 + 20}
                  x2="100%"
                  y2={i * 35 + 40}
                  stroke="url(#line-gradient)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>
          </div>

          {/* KMR GROUP Logo */}
          <div className="absolute top-4 right-6 text-2xl font-bold text-primary">
            KMR GROUP
          </div>

          {/* Neura Token Symbol */}
          <div className="absolute top-4 left-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <span className="text-primary font-bold">NC</span>
            </div>
            <span className="text-sm font-medium text-primary/80">NeuraCoin</span>
          </div>

          {/* Profile Image */}
          <div className="absolute -bottom-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src="attached_assets/6b0c6045-4c98-40cb-9620-04945331849f.webp" alt="Karan Desai" />
              <AvatarFallback>KD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Karan Desai</h2>
              <p className="text-primary font-medium">Founder & CEO, KMR GROUP</p>
            </div>
            <div className="flex gap-2">
              <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                <GlobeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-muted-foreground leading-7">
              A visionary entrepreneur and technology innovator, Karan Desai has revolutionized the intersection of blockchain and artificial intelligence through his groundbreaking work with the Neura Network. As the founder and CEO of KMR GROUP, he has led the development of pioneering solutions in decentralized computing and neural mining.
            </p>

            <p className="text-muted-foreground leading-7">
              The journey of KMR GROUP began in 2021 when Karan identified a crucial gap in the blockchain industry - the need for a more sustainable and intelligent approach to cryptocurrency mining. Drawing from his extensive background in AI and blockchain technologies, he conceived the idea of Neural Mining, a revolutionary concept that would later become the foundation of the Neura Network.
            </p>

            <p className="text-muted-foreground leading-7">
              Under his leadership, KMR GROUP rapidly evolved from a startup to a pioneering force in the blockchain industry. The company's breakthrough came with the development of the NeuraCoin (NC) token, which introduced a unique consensus mechanism that leverages neural networks for mining operations. This innovative approach not only reduced the environmental impact of traditional crypto mining but also contributed to advancing AI research through distributed computing.
            </p>

            <div className="grid gap-4 md:grid-cols-3 mt-8">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-medium">Vision</h3>
                <p className="text-sm text-muted-foreground">Revolutionizing the future of decentralized AI computing</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-medium">Innovation</h3>
                <p className="text-sm text-muted-foreground">Pioneer in neural mining and blockchain technology</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-medium">Leadership</h3>
                <p className="text-sm text-muted-foreground">Building the future of technology with KMR GROUP</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">The KMR GROUP Story</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-7">
                  KMR GROUP's success story is rooted in its commitment to innovation and sustainable technology. From its inception in 2021, the company has focused on developing solutions that bridge the gap between artificial intelligence and blockchain technology. The development of the Neura Network marked a significant milestone, introducing a new paradigm in decentralized computing.
                </p>
                <p className="text-muted-foreground leading-7">
                  The company's flagship project, the Neura Network, has grown from a concept to a thriving ecosystem. By combining neural mining with blockchain technology, KMR GROUP has created a platform that not only processes transactions but also contributes to the advancement of machine learning through its distributed computing network.
                </p>
                <p className="text-muted-foreground leading-7">
                  Today, KMR GROUP continues to push the boundaries of what's possible in technology. Under Karan's leadership, the company has expanded its reach globally, partnering with leading institutions and organizations to further develop and implement neural mining solutions. The company's commitment to innovation and sustainability has positioned it as a leader in the next generation of blockchain technology.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}