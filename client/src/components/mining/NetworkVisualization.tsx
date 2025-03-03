import { useRef, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Mock data for visualization
const mockData = {
  nodes: [
    { id: "main", username: "You", val: 30, color: "#00A3FF" },
    { id: "node1", username: "Miner 1", val: 20, color: "#00A3FF" },
    { id: "node2", username: "Miner 2", val: 25, color: "#00A3FF" },
    { id: "node3", username: "Miner 3", val: 15, color: "#94a3b8" },
    { id: "node4", username: "Miner 4", val: 22, color: "#00A3FF" },
    { id: "node5", username: "Miner 5", val: 18, color: "#94a3b8" },
  ],
  links: [
    { source: "main", target: "node1" },
    { source: "main", target: "node2" },
    { source: "node1", target: "node3" },
    { source: "node2", target: "node4" },
    { source: "node2", target: "node5" },
    { source: "node4", target: "node5" },
  ],
};

export default function NetworkVisualization() {
  const graphRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: Math.min(500, window.innerHeight * 0.6),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full bg-card rounded-lg border border-border shadow-lg overflow-hidden"
    >
      {dimensions.width > 0 ? (
        <ForceGraph2D
          ref={graphRef}
          graphData={mockData}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="username"
          nodeColor="color"
          linkColor={() => "#e2e8f0"}
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const label = node.username;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              bckgDimensions[0],
              bckgDimensions[1]
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);
          }}
          cooldownTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
        />
      ) : (
        <div className="h-[500px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}