import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Brain, Trophy, Star, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import NeuronGame from "./NeuronGame";
import PersonalityQuiz from "./PersonalityQuiz";

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingFlow({ isOpen, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<"neuron-game" | "quiz" | "rewards">("neuron-game");
  const [personalityResult, setPersonalityResult] = useState<Record<string, number> | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (step === "rewards" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      onComplete();
    }
  }, [step, timeLeft, onComplete]);

  const handleQuizComplete = (result: Record<string, number>) => {
    setPersonalityResult(result);
    setStep("rewards");
  };

  const handleNeuronGameComplete = () => {
    setStep("quiz");
  };

  const handleClose = () => {
    if (step === "rewards") {
      onComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[425px] h-auto max-h-[90vh] overflow-y-auto my-auto bg-background"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle>
            {step === "neuron-game" && "Welcome to the Learning Platform!"}
            {step === "quiz" && "Learning Style Quiz"}
            {step === "rewards" && "Early Adopter Rewards!"}
          </DialogTitle>
          <DialogDescription>
            {step === "neuron-game" && "Start your journey by completing this neural connection game."}
            {step === "quiz" && "Help us understand your learning style by answering a few questions."}
            {step === "rewards" && "Congratulations on completing your onboarding!"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {step === "neuron-game" && (
            <NeuronGame onComplete={handleNeuronGameComplete} />
          )}

          {step === "quiz" && (
            <PersonalityQuiz onComplete={handleQuizComplete} />
          )}

          {step === "rewards" && personalityResult && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="relative flex justify-center">
                  <motion.div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundColor: 'hsl(var(--primary) / 0.2)',
                      borderRadius: '9999px',
                      filter: 'blur(8px)'
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.1, 0.2]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    <Trophy className="h-12 w-12 text-primary" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-primary">
                  Early Adopter Rewards!
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Star className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span>One of first 500,000 users!</span>
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  >
                    <Star className="h-4 w-4 text-primary" />
                  </motion.div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Auto-closing in {timeLeft}s
                </div>
              </div>

              <div className="space-y-4 rounded-lg p-4" style={{ background: 'hsl(var(--primary) / 0.05)' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <Gift className="h-5 w-5 text-primary relative z-10" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'hsl(var(--primary) / 0.3)' }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Welcome Bonus</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-primary">100 NeuraCoin</span>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                      </motion.div>
                      <span className="text-xs text-muted-foreground">(Early adopter exclusive)</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <Brain className="h-5 w-5 text-primary relative z-10" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'hsl(var(--primary) / 0.3)' }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Learning Style Bonus</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-primary">1.5x Learning Multiplier</span>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <Users className="h-5 w-5 text-primary relative z-10" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'hsl(var(--primary) / 0.3)' }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Network Pioneer Status</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-primary">Exclusive Pioneer Badge</span>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Sparkles className="h-3 w-3 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-medium mb-2">Your Learning Profile:</p>
                  <div className="space-y-2">
                    {Object.entries(personalityResult)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, score], index) => (
                        <motion.div
                          key={type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="rounded-full overflow-hidden"
                          style={{ background: 'hsl(var(--muted))' }}
                        >
                          <motion.div
                            className="py-1 px-3 text-xs"
                            style={{ 
                              width: `${(score / 3) * 100}%`,
                              background: 'hsl(var(--primary) / 0.2)'
                            }}
                          >
                            <span className="capitalize">
                              {type}: {((score / 3) * 100).toFixed(0)}%
                            </span>
                          </motion.div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                style={{
                  background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8))'
                }}
                onClick={onComplete}
              >
                Start Your Journey ({timeLeft}s)
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}