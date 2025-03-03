import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      question: "What is Neura Network?",
      answer: "Neura Network is a revolutionary decentralized platform that combines neural mining, AI technologies, and blockchain to create a sustainable and intelligent digital ecosystem."
    },
    {
      question: "How does Neural Mining work?",
      answer: "Neural Mining is our innovative approach where users contribute computational power to train AI models, earning NeuraCoin (NC) rewards while helping advance machine learning capabilities."
    },
    {
      question: "What are the minimum requirements to start mining?",
      answer: "To start mining, you need a modern computer with at least 8GB RAM and a stable internet connection. No specialized hardware is required as we focus on neural computation rather than traditional crypto mining."
    },
    {
      question: "How are rewards calculated?",
      answer: "Rewards are calculated based on your contribution to the network, including factors like computational power provided, uptime, and quality of neural training data produced."
    },
    {
      question: "What is the role of NeuraCoin (NC)?",
      answer: "NeuraCoin (NC) is the native token of the Neura Network, used for rewards, governance voting, accessing premium features, and participating in the network's economy."
    },
    {
      question: "How can I become a validator?",
      answer: "To become a validator, you need to stake a minimum of 10,000 NC and maintain 99.9% uptime. The role comes with additional responsibilities and rewards in network governance."
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about Neura Network</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}