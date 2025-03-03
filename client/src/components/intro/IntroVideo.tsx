import { useState, useEffect } from "react";
import { KmrLogo } from "../branding/KmrLogo";
import { NeuraLogo } from "../branding/NeuraLogo";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

const slides = [
  {
    id: "logos",
    duration: 3000,
    content: (
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <KmrLogo className="h-24 w-24" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NeuraLogo className="h-20 w-20" />
        </motion.div>
      </div>
    ),
  },
  {
    id: "neura",
    duration: 4000,
    content: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary">NeuraCoin (NC)</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Revolutionary cryptocurrency powered by neural mining technology.
          Combining blockchain innovation with artificial intelligence.
        </p>
      </motion.div>
    ),
  },
  {
    id: "kmr",
    duration: 4000,
    content: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary">KMR GROUP</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Pioneer in blockchain and AI technology, leading the future of
          decentralized computing through innovative solutions.
        </p>
      </motion.div>
    ),
  },
  {
    id: "ceo",
    duration: 4000,
    content: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary">
          <img
            src="attached_assets/6b0c6045-4c98-40cb-9620-04945331849f.webp"
            alt="Karan Desai"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-primary">Karan Desai</h2>
        <p className="text-lg text-primary/80">Founder & CEO</p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Visionary entrepreneur revolutionizing the intersection of blockchain
          and artificial intelligence through Neura Network.
        </p>
      </motion.div>
    ),
  },
];

export default function IntroVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setLocation("/welcome");
      return;
    }

    // Progress through slides
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(current => current + 1);
      } else {
        sessionStorage.setItem("hasSeenIntro", "true");
        setLocation("/welcome");
      }
    }, slides[currentSlide].duration);

    return () => clearTimeout(timer);
  }, [currentSlide, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="w-full max-w-lg mx-auto"
        >
          {slides[currentSlide].content}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-primary" : "bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}