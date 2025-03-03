import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Zap } from "lucide-react";

interface MiningAnimationProps {
  onComplete?: () => void;
  isActive: boolean;
}

export default function MiningAnimation({ onComplete, isActive }: MiningAnimationProps) {
  const [hashrate, setHashrate] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Update hashrate randomly every second
    const interval = setInterval(() => {
      const newHashrate = Math.floor(Math.random() * 100) + 50;
      setHashrate(newHashrate);
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="relative p-6 rounded-lg bg-background border">
      <div className="flex flex-col items-center space-y-4">
        {/* Mining Animation */}
        <div className="relative">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.2)',
              borderRadius: '9999px',
              filter: 'blur(16px)'
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="relative z-10"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Brain className="h-16 w-16 text-primary" />
          </motion.div>
        </div>

        {/* Mining Status */}
        <div className="space-y-2 text-center">
          <motion.div 
            className="flex items-center justify-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Mining in Progress</span>
          </motion.div>

          <div className="flex items-center justify-center gap-2 text-primary">
            <Zap className="h-4 w-4" />
            <span className="font-bold">{hashrate} H/s</span>
          </div>
        </div>

        {/* Neural Network Animation */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 1, 0.2]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}