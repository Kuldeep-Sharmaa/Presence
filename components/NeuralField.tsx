"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const NODE_COUNT = 22;
const BASE_SPEED = 0.12;
const CONNECTION_DIST = 140;

export default function NeuralField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const hasExecutedRef = useRef(false);
  const signalTRef = useRef(0); // 0 → 1 progress of transmission

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // initialize nodes once
    nodesRef.current = Array.from({ length: NODE_COUNT }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * BASE_SPEED,
      vy: (Math.random() - 0.5) * BASE_SPEED,
    }));

    let raf = 0;

    const loop = () => {
      const depth = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--presence-depth",
        ) || "0",
      );

      const nodes = nodesRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ---- DEPTH PHYSICS ----
      const speedFactor = 1 - depth * 0.85;
      const scale = 1 + depth * 0.18;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // update positions (calmer with depth)
      for (const n of nodes) {
        n.x += n.vx * speedFactor;
        n.y += n.vy * speedFactor;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // ---- DRAW CONNECTIONS ----
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + depth * 0.12})`;

      const pairs: [Node, Node][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            ctx.globalAlpha = 1 - dist / CONNECTION_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            pairs.push([a, b]); // store for signal path
          }
        }
      }

      // ---- DRAW NODES ----
      ctx.globalAlpha = 0.25 + depth * 0.25;
      ctx.fillStyle = "#ffffff";

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================
      // EXECUTION EVENT — SINGLE DIRECTED TRANSMISSION
      // =========================================================

      if (depth > 0.82 && !hasExecutedRef.current) {
        signalTRef.current += 0.01; // ~1.4s duration

        if (signalTRef.current >= 1) {
          signalTRef.current = 1;
          hasExecutedRef.current = true;
        }
      }

      // draw traveling signal along first few connections
      if (signalTRef.current > 0 && pairs.length > 0) {
        const total = Math.min(6, pairs.length);
        const t = signalTRef.current * total;

        const index = Math.floor(t);
        const localT = t - index;

        if (index < total) {
          const [a, b] = pairs[index];

          const x = a.x + (b.x - a.x) * localT;
          const y = a.y + (b.y - a.y) * localT;

          ctx.globalAlpha = 0.9 * (1 - signalTRef.current * 0.6);
          ctx.fillStyle = "#ffffff";

          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}
