"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HomeHero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={rootRef}
      className="hero text-3xl font-bold text-white tracking-tight"
    >
      Task Manager
    </h1>
  );
}
