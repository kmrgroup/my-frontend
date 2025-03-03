import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemoryNode {
  id: number;
  x: number;
  y: number;
  active: boolean;
  highlighted: boolean;
}

export default function MemoryGame({ onComplete }: { onComplete: () => void }) {
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize game board
  useEffect(() => {
    if (gameStarted) {
      const initialNodes: MemoryNode[] = Array.from({ length: 9 }, (_, i) => ({
        id: i,
        x: (i % 3) * 33 + 16.5,
        y: Math.floor(i / 3) * 33 + 16.5,
        active: false,
        highlighted: false,
      }));
      setNodes(initialNodes);
      generateSequence(level);
    }
  }, [gameStarted, level]);

  const generateSequence = (currentLevel: number) => {
    const newSequence = Array.from({ length: currentLevel + 2 }, () =>
      Math.floor(Math.random() * 9)
    );
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setNodes(prev => prev.map(node => ({
        ...node,
        highlighted: node.id === seq[i]
      })));
      await new Promise(resolve => setTimeout(resolve, 400));
      setNodes(prev => prev.map(node => ({
        ...node,
        highlighted: false
      })));
    }
    setIsPlaying(false);
  };

  const handleNodeClick = (id: number) => {
    if (isPlaying) return;

    const newUserSequence = [...userSequence, id];
    setUserSequence(newUserSequence);
    setNodes(prev => prev.map(node => ({
      ...node,
      active: node.id === id
    })));

    // Check if sequence is correct so far
    if (newUserSequence.every((num, i) => num === sequence[i])) {
      if (newUserSequence.length === sequence.length) {
        // Completed sequence successfully
        setShowSuccess(true);
        setScore(prev => prev + (level * 100));
        setTimeout(() => {
          setShowSuccess(false);
          setUserSequence([]);
          if (level >= 3) {
            onComplete();
          } else {
            setLevel(prev => prev + 1);
          }
        }, 1000);
      }
    } else {
      // Failed sequence
      setNodes(prev => prev.map(node => ({
        ...node,
        active: false,
        highlighted: false
      })));
      setUserSequence([]);
      playSequence(sequence);
    }

    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        active: false
      })));
    }, 300);
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Brain className="h-16 w-16 mx-auto text-primary relative z-10 animate-float" />
        </div>
        <h3 className="text-xl font-semibold">Neural Pattern Memory</h3>
        <p className="text-muted-foreground">
          Train your neural network by memorizing and recreating activation patterns.
          Complete 3 levels to unlock special abilities!
        </p>
        <Button
          onClick={() => setGameStarted(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
        >
          Start Training
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] bg-primary/5 rounded-lg p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-primary">
          <Zap className="h-4 w-4" />
          <span className="font-bold">Level {level}/3</span>
        </div>
        <div className="text-sm font-medium">Score: {score}</div>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto mt-8">
        {nodes.map(node => (
          <motion.button
            key={node.id}
            disabled={isPlaying}
            onClick={() => handleNodeClick(node.id)}
            className={`w-16 h-16 rounded-lg border-2 border-primary relative 
              ${node.highlighted || node.active ? 'bg-primary' : 'hover:bg-primary/20'}
              transition-colors duration-200`}
            whileTap={{ scale: 0.95 }}
          >
            {(node.highlighted || node.active) && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/30"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            className="text-center space-y-2"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star className="h-12 w-12 text-primary mx-auto" />
            </motion.div>
            <h3 className="text-xl font-semibold text-primary">Level Complete!</h3>
            <p className="text-muted-foreground">+{level * 100} points</p>
          </motion.div>
        </motion.div>
      )}

      {isPlaying && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <p className="text-sm text-muted-foreground animate-pulse">
            Watch the pattern...
          </p>
        </div>
      )}
    </div>
  );
}