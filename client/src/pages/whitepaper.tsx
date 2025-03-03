import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Whitepaper() {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Neura Network Whitepaper</h1>
        <p className="text-muted-foreground">Technical Overview and Vision</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Abstract</h2>
                <p className="text-muted-foreground leading-7">
                  Neura Network represents a paradigm shift in decentralized computing, introducing a novel concept of Neural Mining that bridges the gap between blockchain technology and artificial intelligence. This whitepaper outlines our revolutionary approach to creating a sustainable, AI-driven ecosystem.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-7">
                  The exponential growth of AI and blockchain technologies has created an unprecedented opportunity to merge these fields in a way that benefits both individual users and the broader technological landscape. Neura Network introduces a unique solution that democratizes access to AI computation while creating a sustainable economic model.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Neural Mining Protocol</h2>
                <p className="text-muted-foreground leading-7">
                  Our Neural Mining protocol revolutionizes traditional crypto mining by focusing on AI model training instead of cryptographic puzzles. This approach not only provides a more environmentally sustainable alternative but also contributes to the advancement of machine learning technologies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Network Architecture</h2>
                <p className="text-muted-foreground leading-7">
                  The Neura Network is built on a three-layer architecture:
                  - Computation Layer: Handles neural mining and AI model training
                  - Consensus Layer: Manages network validation and governance
                  - Application Layer: Provides user interfaces and developer tools
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Tokenomics</h2>
                <p className="text-muted-foreground leading-7">
                  NeuraCoin (NC) serves as the native token of the network, with a carefully designed economic model that ensures long-term sustainability and value appreciation through:
                  - Mining rewards
                  - Governance participation
                  - Network utility
                  - Staking mechanisms
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Future Roadmap</h2>
                <p className="text-muted-foreground leading-7">
                  Our development roadmap focuses on expanding the network's capabilities while maintaining security and decentralization:
                  - Enhanced AI model training capabilities
                  - Cross-chain integration
                  - Advanced governance mechanisms
                  - Developer toolkit expansion
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
