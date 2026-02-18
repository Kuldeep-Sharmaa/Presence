"use client";

import { useEffect, useRef } from "react";

export default function PresenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    let raf = 0;
    let running = true;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * DPR;
      canvas.height = h * DPR;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const draw = () => {
      if (!running) return;

      t += 0.003; // ultra-slow time

      // micro luminance shift
      const base = 11 + Math.sin(t) * 1.5; // 0-255 scale near #0b
      ctx.fillStyle = `rgb(${base}, ${base}, ${base})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
  pointer-events-none
  fixed inset-0
  -z-10
  opacity-[0.035]
"
      aria-hidden
    />
  );
}
