import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Brain, Book, Users, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: "analytical" | "creative" | "social" | "technical";
    icon: typeof Brain;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How do you prefer to learn new concepts?",
    options: [
      { text: "Through detailed analysis and research", type: "analytical", icon: Brain },
      { text: "By experimenting and exploring", type: "creative", icon: Book },
      { text: "Through discussion with others", type: "social", icon: Users },
      { text: "By building and implementing", type: "technical", icon: Cpu }
    ]
  },
  {
    id: 2,
    text: "What interests you most about blockchain?",
    options: [
      { text: "The mathematical principles", type: "analytical", icon: Brain },
      { text: "The potential for innovation", type: "creative", icon: Book },
      { text: "The community aspects", type: "social", icon: Users },
      { text: "The technical architecture", type: "technical", icon: Cpu }
    ]
  },
  {
    id: 3,
    text: "How would you contribute to the network?",
    options: [
      { text: "By validating and verifying", type: "analytical", icon: Brain },
      { text: "By proposing new ideas", type: "creative", icon: Book },
      { text: "By growing the community", type: "social", icon: Users },
      { text: "By improving the code", type: "technical", icon: Cpu }
    ]
  }
];

interface PersonalityQuizProps {
  onComplete: (result: Record<string, number>) => void;
}

export default function PersonalityQuiz({ onComplete }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    analytical: 0,
    creative: 0,
    social: 0,
    technical: 0
  });

  const handleAnswer = (type: string) => {
    const newAnswers = {
      ...answers,
      [type]: answers[type] + 1
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Personality Quiz</h3>
        <p className="text-sm text-muted-foreground">
          Let's personalize your learning journey
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        {questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-xl font-medium">{questions[currentQuestion].text}</h4>
            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center gap-3 h-auto p-4 justify-start hover:bg-primary/5"
                  onClick={() => handleAnswer(option.type)}
                >
                  <option.icon className="h-5 w-5 text-primary" />
                  <span>{option.text}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}