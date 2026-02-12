"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  DollarSign,
  Flame,
  Clock,
  Target,
  type LucideIcon,
} from "lucide-react";

interface VitalCardProps {
  title: string;
  value: string;
  numericValue: number;
  icon: "cash" | "burn" | "runway" | "breakeven";
  status: "healthy" | "caution" | "critical";
  isCritical: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  cash: DollarSign,
  burn: Flame,
  runway: Clock,
  breakeven: Target,
};

const STATUS_COLORS = {
  healthy: {
    border: "border-success/30",
    glow: "glow-success",
    icon: "text-success",
    bg: "bg-success/10",
  },
  caution: {
    border: "border-warning/30",
    glow: "glow-warning",
    icon: "text-warning",
    bg: "bg-warning/10",
  },
  critical: {
    border: "border-destructive/30",
    glow: "glow-destructive",
    icon: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export default function VitalCard({
  title,
  value,
  numericValue,
  icon,
  status,
  isCritical,
}: VitalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef(numericValue);

  const Icon = ICON_MAP[icon];
  const colors = STATUS_COLORS[status];

  // Rolling number animation
  useEffect(() => {
    if (!valueRef.current) return;
    const el = valueRef.current;
    const from = prevValueRef.current;
    const to = numericValue;
    prevValueRef.current = numericValue;

    const obj = { val: from };
    gsap.to(obj, {
      val: to,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        if (icon === "cash") {
          const v = obj.val;
          if (v >= 1000000) {
            el.textContent = `$${(v / 1000000).toFixed(1)}M`;
          } else if (v >= 1000) {
            el.textContent = `$${(v / 1000).toFixed(0)}K`;
          } else {
            el.textContent = `$${v.toFixed(0)}`;
          }
        } else if (icon === "burn") {
          el.textContent = `$${(obj.val / 1000).toFixed(1)}K`;
        } else if (icon === "runway") {
          if (obj.val >= 999) {
            el.textContent = "Safe";
          } else {
            el.textContent = `${obj.val.toFixed(1)} mo`;
          }
        } else {
          if (obj.val <= 0 || obj.val > 36) {
            el.textContent = "N/A";
          } else {
            el.textContent = `Month ${Math.round(obj.val)}`;
          }
        }
      },
    });
  }, [numericValue, icon]);

  // Critical pulse animation
  useEffect(() => {
    if (!cardRef.current) return;
    if (isCritical) {
      gsap.to(cardRef.current, {
        boxShadow:
          "0 0 30px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)",
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    } else {
      gsap.killTweensOf(cardRef.current);
      gsap.to(cardRef.current, {
        boxShadow: "none",
        duration: 0.3,
      });
    }
    return () => {
      if (cardRef.current) gsap.killTweensOf(cardRef.current);
    };
  }, [isCritical]);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col gap-3 rounded-2xl border ${colors.border} bg-card p-5 ${colors.glow} transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <div className={`rounded-lg p-2 ${colors.bg}`}>
          <Icon className={`h-4 w-4 ${colors.icon}`} />
        </div>
      </div>
      <span
        ref={valueRef}
        className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
      >
        {value}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            status === "healthy"
              ? "bg-success"
              : status === "caution"
                ? "bg-warning"
                : "bg-destructive"
          }`}
        />
        <span className="text-xs text-muted-foreground capitalize">
          {status}
        </span>
      </div>
    </div>
  );
}
