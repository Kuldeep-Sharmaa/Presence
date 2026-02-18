"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FormationText() {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start clearly smaller + faint
    gsap.set(el, {
      opacity: 0,
      scale: 0.6,
      y: 40,
    });

    // Main cinematic growth while scrolling
    gsap.to(el, {
      opacity: 0.9,
      scale: 2.4, // ← BIGGER impact (key change)
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "45% top",
        scrub: true,
      },
    });

    // Calm disappearance after peak
    gsap.to(el, {
      opacity: 0,
      scale: 2.8,
      y: -140,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "45% top",
        end: "65% top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={ref}
      className="formation-text"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 50,
        color: "rgba(255,255,255,0.75)",

        /* IMPORTANT: base size smaller so scale feels huge */
        fontSize: "12px",

        letterSpacing: "0.28em",
        textTransform: "lowercase",
        fontWeight: 300,
        userSelect: "none",
      }}
    >
      in formation
    </div>
  );
}
