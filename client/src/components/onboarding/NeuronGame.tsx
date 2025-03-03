import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Neuron {
  id: number;
  x: number;
  y: number;
  connections: number[];
  active: boolean;
  energy: number;
}

export default function NeuronGame({ onComplete }: { onComplete: () => void }) {
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [particles, setParticles] = useState<{x: number, y: number}[]>([]);

  // Initialize neurons
  useEffect(() => {
    if (gameStarted) {
      const initialNeurons: Neuron[] = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        connections: [],
        active: false,
        energy: 0
      }));
      setNeurons(initialNeurons);
    }
  }, [gameStarted]);

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 5 }, () => ({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 1000);
  };

  const activateNeuron = (id: number) => {
    if (completed) return;

    setNeurons(prev => {
      const newNeurons = [...prev];
      const neuron = newNeurons.find(n => n.id === id);
      if (neuron) {
        neuron.active = true;
        neuron.energy = 100;
        createParticles(neuron.x, neuron.y);

        // Chain reaction with delay
        setTimeout(() => {
          neuron.connections.forEach((connectedId, index) => {
            setTimeout(() => {
              setNeurons(current => {
                const updated = [...current];
                const connected = updated.find(n => n.id === connectedId);
                if (connected) {
                  connected.active = true;
                  connected.energy = 100;
                  createParticles(connected.x, connected.y);
                }
                return updated;
              });
            }, index * 200); // Cascade effect
          });
        }, 200);
      }
      return newNeurons;
    });

    setScore(prev => {
      const newScore = prev + 1 + Math.floor(combo / 2);
      if (newScore >= 10) {
        setCompleted(true);
        setTimeout(onComplete, 1500);
      }
      return newScore;
    });
    setCombo(prev => prev + 1);
  };

  const createConnection = (fromId: number, toId: number) => {
    setNeurons(prev => {
      const newNeurons = [...prev];
      const fromNeuron = newNeurons.find(n => n.id === fromId);
      if (fromNeuron && !fromNeuron.connections.includes(toId)) {
        fromNeuron.connections.push(toId);
        createParticles((fromNeuron.x + newNeurons[toId].x) / 2, 
                       (fromNeuron.y + newNeurons[toId].y) / 2);
      }
      return newNeurons;
    });
  };

  // Energy decay effect
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setNeurons(prev => 
        prev.map(n => ({
          ...n,
          energy: Math.max(0, n.energy - 2)
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameStarted]);

  if (!gameStarted) {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Brain className="h-16 w-16 mx-auto text-primary relative z-10 animate-float" />
        </div>
        <h3 className="text-xl font-semibold">Neural Connection Challenge</h3>
        <p className="text-muted-foreground">
          Create neural pathways by connecting and activating neurons. 
          Chain reactions earn bonus points!
        </p>
        <Button 
          onClick={() => setGameStarted(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
        >
          Start Challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] bg-primary/5 rounded-lg p-4 overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-1 text-primary">
          <Star className="h-4 w-4" />
          <span className="font-bold">{score}/10</span>
        </div>
        {combo > 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary/20 px-2 py-1 rounded-full text-xs font-medium"
          >
            {combo}x Combo!
          </motion.div>
        )}
      </div>

      {/* Particle effects */}
      <AnimatePresence>
        {particles.map((particle, i) => (
          <motion.div
            key={`particle-${i}-${particle.x}-${particle.y}`}
            initial={{ 
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              scale: 1,
              opacity: 1 
            }}
            animate={{ 
              scale: 0,
              opacity: 0,
              x: `${particle.x + (Math.random() - 0.5) * 20}%`,
              y: `${particle.y + (Math.random() - 0.5) * 20}%`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-1 h-1 bg-primary rounded-full"
          />
        ))}
      </AnimatePresence>

      {/* Neural connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {neurons.map(neuron => 
          neuron.connections.map(targetId => {
            const target = neurons.find(n => n.id === targetId);
            if (target) {
              return (
                <motion.line
                  key={`${neuron.id}-${targetId}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={`${neuron.x}%`}
                  y1={`${neuron.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="currentColor"
                  className={`text-primary/30 ${
                    neuron.active && target.active ? 'opacity-100' : 'opacity-50'
                  }`}
                  strokeWidth="2"
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Neurons */}
      <AnimatePresence>
        {neurons.map(neuron => (
          <motion.div
            key={neuron.id}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              background: neuron.active 
                ? "rgb(var(--primary))" 
                : "transparent"
            }}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 
              border-primary cursor-pointer transition-colors duration-200
              ${neuron.active ? 'bg-primary shadow-lg shadow-primary/50' : 'hover:bg-primary/20'}`}
            style={{ 
              left: `${neuron.x}%`, 
              top: `${neuron.y}%`,
            }}
            onClick={() => activateNeuron(neuron.id)}
            onMouseEnter={() => {
              const nearbyNeurons = neurons.filter(n => 
                n.id !== neuron.id && 
                Math.abs(n.x - neuron.x) < 30 && 
                Math.abs(n.y - neuron.y) < 30
              );
              nearbyNeurons.forEach(nearby => createConnection(neuron.id, nearby.id));
            }}
          >
            {neuron.energy > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {completed && (
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
            <h3 className="text-xl font-semibold text-primary">Challenge Complete!</h3>
            <p className="text-muted-foreground">You've unlocked special rewards!</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}