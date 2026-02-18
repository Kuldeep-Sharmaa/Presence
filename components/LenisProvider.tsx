"use client";

import useLenis from "./useLenis";

export default function LenisProvider() {
    useLenis();
    return null; // no UI, only behavior
}
