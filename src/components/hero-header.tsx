"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Plane } from "lucide-react";

export default function HeroHeader() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8 },
        "-=0.3"
      );
  }, []);

  return (
    <header className="relative flex flex-col items-center gap-4 overflow-hidden px-4 pb-8 pt-12 text-center lg:pt-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
        <Plane className="h-4 w-4 text-accent" />
        <span className="text-xs font-semibold tracking-wider text-accent uppercase">
          Digital Twin Cockpit
        </span>
      </div>

      <h1
        ref={titleRef}
        className="text-4xl font-bold tracking-tight text-foreground opacity-0 lg:text-6xl"
      >
        Runway<span className="text-accent">Twin</span>
      </h1>

      <p
        ref={subtitleRef}
        className="max-w-lg text-lg leading-relaxed text-muted-foreground opacity-0 lg:text-xl"
      >
        A flight simulator for startup survival.
        <br />
        <span className="text-sm text-muted-foreground/70">
          Simulate decisions before spending real money.
        </span>
      </p>

      <div
        ref={lineRef}
        className="mt-4 h-px w-full max-w-4xl origin-center bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
    </header>
  );
}
