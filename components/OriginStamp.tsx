"use client";

import { useEffect, useRef, useState } from "react";

export default function OriginStamp() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const depth = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--presence-depth",
        ) || "0",
      );

      const el = ref.current;

      if (el) {
        // show near end
        if (depth > 0.8) setVisible(true);

        // scale only in final stretch (0.92 → 1.0)
        const local = Math.min(Math.max((depth - 0.92) / 0.08, 0), 1);

        const scale = 1 + local * 2.5; // grows large but calm
        const opacity = 0.4 + local * 0.6;

        el.style.transform = `translateX(-50%) scale(${scale})`;
        el.style.opacity = opacity.toString();
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%) scale(1)",
        pointerEvents: "none",
        zIndex: 40,

        color: "rgba(255,255,255,0.9)",
        fontSize: "14px",
        letterSpacing: "0.06em",
        fontWeight: 500,
        textTransform: "lowercase",
        userSelect: "none",

        opacity: visible ? 0.4 : 0,
        transition: "opacity 0.6s ease",
        willChange: "transform, opacity",
      }}
    >
      built in india.
    </div>
  );
}
