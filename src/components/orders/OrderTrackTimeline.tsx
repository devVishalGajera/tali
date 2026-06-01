"use client";

import type { ReactNode } from "react";
import type { OrderTrackStep } from "@/lib/api/order";

type StepKey = "placed" | "confirmed" | "packed" | "delivery" | "delivered";

const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const StepIcons: Record<StepKey, (className: string) => ReactNode> = {
  placed: (className) => (
    <svg {...iconProps} className={className}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  confirmed: (className) => (
    <svg {...iconProps} className={className}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  packed: (className) => (
    <svg {...iconProps} className={className}>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  delivery: (className) => (
    <svg {...iconProps} className={className}>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  delivered: (className) => (
    <svg {...iconProps} className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
};

const CheckIcon = ({ className }: { className: string }) => (
  <svg {...iconProps} className={className} strokeWidth={2.5}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

function resolveStepKey(key: string): StepKey {
  if (key === "placed" || key === "confirmed" || key === "packed" || key === "delivery" || key === "delivered") {
    return key;
  }
  if (key === "processing") return "packed";
  return "placed";
}

const StepCircle = ({ step }: { step: OrderTrackStep }) => {
  const done = step.completed;
  const active = step.active;
  const accent = done || active;
  const stepKey = resolveStepKey(step.key);
  const renderIcon = StepIcons[stepKey];

  return (
    <div
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        accent
          ? "bg-[#006B4D] border-[#006B4D] text-white"
          : "bg-white border-[#E0E0E0] text-[#B0B0B0]"
      }`}
    >
      {done && !active ? (
        <CheckIcon className="text-white" />
      ) : (
        renderIcon(accent ? "text-white" : "text-[#B0B0B0]")
      )}
    </div>
  );
};

interface Props {
  steps: OrderTrackStep[];
}

const OrderTrackTimeline = ({ steps }: Props) => {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex min-w-[680px] sm:min-w-0 items-start justify-between gap-1 relative">
        {steps.map((step, i) => {
          const segmentDone = step.completed;
          return (
            <div key={step.key} className="relative flex flex-col items-center flex-1 min-w-[88px]">
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-5 sm:top-[22px] left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${
                    segmentDone ? "bg-[#006B4D]" : "bg-[#E8E8E8]"
                  }`}
                  aria-hidden
                />
              )}
              <StepCircle step={step} />
              <p
                className={`text-[11px] sm:text-xs font-bold mt-3 text-center leading-tight ${
                  step.active ? "text-[#006B4D]" : step.completed ? "text-[#1D1D1D]" : "text-[#1D1D1D80]"
                }`}
              >
                {step.label}
              </p>
              {step.timestamp && (
                <p className="text-[10px] text-[#1D1D1D80] mt-1 text-center leading-snug px-0.5 max-w-[120px]">
                  {step.timestamp}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackTimeline;
