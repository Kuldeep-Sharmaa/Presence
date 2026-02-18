"use client";

import { useEffect } from "react";

export default function PresenceEngine() {
  useEffect(() => {
    let raf = 0;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const update = () => {
      const depth = maxScroll() > 0 ? window.scrollY / maxScroll() : 0;

      // clamp 0 → 1
      const clamped = Math.min(1, Math.max(0, depth));

      // expose globally
      document.documentElement.style.setProperty(
        "--presence-depth",
        clamped.toString(),
      );

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
