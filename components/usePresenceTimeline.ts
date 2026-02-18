"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function usePresenceTimeline() {
  useEffect(() => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const onScroll = () => {
      const progress = window.scrollY / maxScroll;

      // subtle global opacity breathing based on depth
      gsap.to("body", {
        opacity: 0.98 + progress * 0.03,
        duration: 0.3,
        ease: "none",
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
