import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { SimulationNodeDatum, forceSimulation, forceManyBody, forceCenter, forceLink } from 'd3-force';
import { Loader2 } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface Node extends SimulationNodeDatum {
  id: string;
  type: 'user' | 'transaction';
  x?: number;
  y?: number;
  value?: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

const INITIAL_NODES: Node[] = [
  { id: 'node-1', type: 'user', x: 0, y: 0 },
  { id: 'node-2', type: 'user', x: 0, y: 0 },
  { id: 'node-3', type: 'user', x: 0, y: 0 },
  { id: 'tx-1', type: 'transaction', value: 50, x: 0, y: 0 },
];

const INITIAL_LINKS: Link[] = [
  { source: 'node-1', target: 'tx-1', value: 50 },
  { source: 'tx-1', target: 'node-2', value: 50 },
];

export default function TransactionVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [links, setLinks] = useState<Link[]>(INITIAL_LINKS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Animation spring for nodes
  const props = useSpring({
    to: { opacity: 1, scale: 1 },
    from: { opacity: 0, scale: 0 },
    reset: true,
  });

  // Update dimensions when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      setIsInitialized(true);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!nodes.length || !dimensions.width || !dimensions.height) return;

    // Set up D3 force simulation
    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('link', forceLink(links).id((d: any) => d.id).distance(80));

    // Update node positions on each tick
    simulation.on('tick', () => {
      setNodes([...nodes]);
      setLinks([...links]);
    });

    return () => simulation.stop();
  }, [nodes, links, dimensions]);

  const addTransaction = (transaction: Transaction) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) / 4;
    const angle = Math.random() * 2 * Math.PI;

    // Add new nodes with random positions around the center
    const newNodes: Node[] = [
      ...nodes.slice(-20), // Keep only last 20 nodes
      { 
        id: transaction.from, 
        type: 'user',
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      },
      { 
        id: transaction.to, 
        type: 'user',
        x: centerX + radius * Math.cos(angle + Math.PI),
        y: centerY + radius * Math.sin(angle + Math.PI)
      },
      { 
        id: transaction.id, 
        type: 'transaction',
        value: transaction.amount,
        x: centerX,
        y: centerY
      }
    ];

    // Add links from sender to transaction and transaction to receiver
    const newLinks: Link[] = [
      ...links.slice(-40), // Keep only last 40 links
      { source: transaction.from, target: transaction.id, value: transaction.amount },
      { source: transaction.id, target: transaction.to, value: transaction.amount }
    ];

    setNodes(newNodes);
    setLinks(newLinks);
  };

  // Demo transaction for testing
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const interval = setInterval(() => {
      const demoTransaction = {
        id: `tx-${Date.now()}`,
        from: `user-${Math.floor(Math.random() * 5)}`,
        to: `user-${Math.floor(Math.random() * 5)}`,
        amount: Math.random() * 100,
        timestamp: Date.now()
      };
      addTransaction(demoTransaction);
    }, 3000);

    return () => clearInterval(interval);
  }, [dimensions]);

  if (!isInitialized || !dimensions.width || !dimensions.height) {
    return (
      <div ref={containerRef} className="w-full h-[600px] rounded-lg border flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[600px] rounded-lg border">
      <svg width={dimensions.width} height={dimensions.height}>
        <animated.g style={props}>
          {/* Draw links */}
          {links.map((link, i) => (
            <line
              key={`link-${i}`}
              x1={nodes.find(n => n.id === link.source)?.x || 0}
              y1={nodes.find(n => n.id === link.source)?.y || 0}
              x2={nodes.find(n => n.id === link.target)?.x || 0}
              y2={nodes.find(n => n.id === link.target)?.y || 0}
              stroke="currentColor"
              strokeOpacity={0.2}
              strokeWidth={Math.sqrt(link.value)}
            />
          ))}
          {/* Draw nodes */}
          {nodes.map((node, i) => (
            <g
              key={`node-${i}`}
              transform={`translate(${node.x || 0},${node.y || 0})`}
            >
              <circle
                r={node.type === 'transaction' ? 4 : 8}
                fill={node.type === 'transaction' ? '#0091ff' : '#666'}
                strokeWidth={2}
                stroke={node.type === 'transaction' ? '#0091ff33' : '#66666633'}
                className="transition-colors duration-200"
              />
              <title>{node.id}</title>
            </g>
          ))}
        </animated.g>
      </svg>
    </div>
  );
}