"use client";

import { useRef } from "react";

export default function DepthField() {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={ref}
            className="
        pointer-events-none
        fixed inset-0
        -z-0
        opacity-[0.02]
      "
            style={{
                backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
        `,
                backgroundSize: "120px 120px",
            }}
        />
    );
}
