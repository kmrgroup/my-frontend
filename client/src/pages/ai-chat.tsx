import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Send } from "lucide-react";

export default function AIChat() {
  const [messages, setMessages] = useState<Array<{text: string, isBot: boolean}>>([
    { text: "Hello! I'm your NeuraCoin AI assistant. How can I help you learn about blockchain and mining today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput("");

    // Simulated AI responses based on keywords
    setTimeout(() => {
      let response = "";
      const lowercaseInput = input.toLowerCase();

      if (lowercaseInput.includes("blockchain")) {
        response = "A blockchain is a distributed digital ledger that stores data in blocks that are linked together using cryptography. Each block contains transaction data, a timestamp, and a cryptographic hash of the previous block.";
      } else if (lowercaseInput.includes("mining")) {
        response = "Cryptocurrency mining is the process of validating and adding new transactions to the blockchain. Miners use powerful computers to solve complex mathematical problems, and when successful, they receive rewards in the form of new coins.";
      } else if (lowercaseInput.includes("hash") || lowercaseInput.includes("hashrate")) {
        response = "Hash rate is the speed at which a mining machine can complete the mathematical calculations required to mine cryptocurrency. A higher hash rate means more mining power and better chances of earning rewards.";
      } else if (lowercaseInput.includes("wallet")) {
        response = "A cryptocurrency wallet is a digital tool that allows you to store, send, and receive digital currencies. It contains your private keys which prove your ownership of coins and allow you to make transactions.";
      } else {
        response = "I'm here to help you understand blockchain technology and mining concepts. Feel free to ask about specific topics like blockchain, mining, hash rates, or wallets!";
      }

      setMessages(prev => [...prev, {
        text: response,
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-16 md:pb-0">
      <h1 className="text-3xl font-bold">AI Support</h1>

      <Card className="h-[calc(100vh-200px)]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">NeuraCoin Assistant</h2>
          </div>
        </CardHeader>

        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.isBot
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about blockchain, mining, or NeuraCoin..."
              className="flex-1"
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}