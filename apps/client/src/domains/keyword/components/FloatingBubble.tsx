import { useRef, useEffect } from 'react';
import * as Matter from 'matter-js';
import { generateInitialBubblePositions, calculateBubbleScale } from '../utils/bubblePhysics';
import type { BubblePhysicsConfig, CanvasDimensions } from '../types/entity';

interface FloatingBubbleProps {
  /** Array of keyword strings to display as bubbles */
  keywords: string[];
  /** Array of currently selected keywords */
  selected: string[];
  /** Callback when a bubble is clicked */
  onSelect: (keyword: string) => void;
  /** Physics configuration */
  config: BubblePhysicsConfig;
  /** Canvas dimensions */
  canvasDimensions: CanvasDimensions;
}

/**
 * FloatingBubble component renders interactive keyword bubbles with matter.js physics
 */
export function FloatingBubble({ keywords, selected, onSelect, config, canvasDimensions }: FloatingBubbleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    const positions = generateInitialBubblePositions(keywords, canvasDimensions, config);

    keywords.forEach((keyword, index) => {
      const pos = positions[index];
      if (!pos) return;

      const body = Matter.Bodies.circle(pos.x, pos.y, config.bubbleRadius, {
        restitution: 0.8,
        friction: 0.5,
        frictionAir: 0.02,
        label: keyword,
      });

      Matter.World.add(engine.world, body);
      bodiesRef.current.set(keyword, body);
    });

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      bodiesRef.current.forEach((body, keyword) => {
        const dx = body.position.x - x;
        const dy = body.position.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.bubbleRadius * 1.2) {
          onSelect(keyword);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      bodiesRef.current.forEach((body, keyword) => {
        const isSelected = selected.includes(keyword);
        const scale = calculateBubbleScale(isSelected);
        const radius = config.bubbleRadius * scale;

        ctx.fillStyle = isSelected ? '#3b82f6' : '#e5e7eb';
        ctx.beginPath();
        ctx.arc(body.position.x, body.position.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#1e40af' : '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(keyword, body.position.x, body.position.y);
      });

      requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      if (runnerRef.current) {
        Matter.Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
      bodiesRef.current.clear();
    };
  }, [keywords, config, canvasDimensions, onSelect, selected]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasDimensions.width}
      height={canvasDimensions.height}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
}
