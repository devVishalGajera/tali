"use client";

import { useMemo } from "react";

const COLORS = ["#006B4D", "#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#F97316"];

const ConfettiBurst = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: `${(i % 12) * 0.08}s`,
        duration: `${2.2 + (i % 5) * 0.3}s`,
        color: COLORS[i % COLORS.length],
        size: 6 + (i % 4) * 2,
        rotate: (i * 47) % 360,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute rounded-sm opacity-90"
          style={{
            left: p.left,
            top: "-8px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiBurst;
