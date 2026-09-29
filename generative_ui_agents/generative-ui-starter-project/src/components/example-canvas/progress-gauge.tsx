"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";

interface ProgressGaugeProps {
  total: number;
  completed: number;
}

export function ProgressGauge({ total, completed }: ProgressGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const [arcProgress, setArcProgress] = useState(0);
  const ringRef = useRef<SVGCircleElement>(null);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = Math.max(0, total - completed);

  // Ring geometry
  const r = 31;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (arcProgress / 100) * circumference;

  // Animate the arc from 0 → target percentage on mount and when data changes
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setArcProgress(percentage), 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex justify-center mb-8">
      <div
        className="relative w-full max-w-[340px] aspect-[5/4] rounded-[20px] overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #4a90c2 0%, #85ecce 50%, #b8e0f0 100%)" }}
        role="img"
        aria-label={`${percentage} percent of tasks completed`}
      >
        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.72) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top row: label + ring */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-[18px] z-[3]">
          <span
            className="text-[1.05rem] font-bold text-white tracking-[-0.01em] leading-none pt-1.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Pokrok
          </span>

          {/* Progress ring */}
          <div
            className="relative w-[76px] h-[76px] flex-shrink-0 transition-opacity duration-500"
            style={{ opacity: mounted ? 1 : 0 }}
          >
            <svg
              className="w-[76px] h-[76px] -rotate-90 overflow-visible"
              viewBox="0 0 76 76"
              aria-hidden="true"
            >
              <circle cx="38" cy="38" r="34" fill="rgba(0,0,0,0.32)" />
              <circle
                cx="38"
                cy="38"
                r="31"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="6"
              />
              <circle
                ref={ringRef}
                cx="38"
                cy="38"
                r="31"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{
                  transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[0.95rem] font-bold text-white tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-[18px] z-[2]">
          <h2
            className="text-[1.5rem] font-bold text-white m-0 mb-1 tracking-[-0.02em] leading-[1.1]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Dokončené úkoly
          </h2>
          <p
            className="text-[0.85rem] font-normal text-white/65 m-0 mb-3.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {completed} / {total} úkolů hotovo
          </p>

          <div className="flex items-center justify-between">
            <button
              className="w-[38px] h-[38px] rounded-full bg-black/38 border-none flex items-center justify-center text-white cursor-pointer transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Share progress"
            >
              <Share2 className="w-[17px] h-[17px]" />
            </button>

            <button
              className="bg-white text-[#111] border-none rounded-full px-5 py-2.5 text-sm font-semibold cursor-pointer whitespace-nowrap tracking-[-0.01em] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {remaining > 0
                ? `${remaining} zbývá`
                : total > 0
                  ? "Vše hotovo"
                  : "Žádné úkoly"}
              <span
                className="inline-block ml-1.5 transition-transform duration-300"
                style={{
                  animation: "g2-arrow-nudge 0.9s ease 1.7s 2",
                }}
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes g2-arrow-nudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
