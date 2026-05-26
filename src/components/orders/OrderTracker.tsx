"use client";

import type { OrderTrackStep } from "@/lib/api/order";

const StepIcon = ({ step }: { step: OrderTrackStep }) => {
  const color = step.completed || step.active ? "text-[#006B4D]" : "text-[#C5C5C5]";
  const bg = step.completed || step.active ? "bg-[#E8F5EF] border-[#006B4D]" : "bg-[#F5F5F5] border-[#E8E8E8]";

  return (
    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${bg}`}>
      {step.key === "placed" && (
        <svg className={color} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h18M16 10a4 4 0 01-8 0" />
        </svg>
      )}
      {step.key === "processing" && (
        <svg className={color} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
      )}
      {step.key === "delivery" && (
        <svg className={color} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="5" cy="17" r="2" />
          <circle cx="19" cy="17" r="2" />
          <path d="M7 17h10M5 17l1-7h12l1 7" />
        </svg>
      )}
      {step.key === "delivered" && (
        <svg className={color} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l9-9 9 9M5 10v10h14V10" />
        </svg>
      )}
    </div>
  );
};

interface Props {
  steps: OrderTrackStep[];
  compact?: boolean;
}

const OrderTracker = ({ steps, compact = false }: Props) => {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 lg:grid-cols-4"}`}>
      {steps.map((step, i) => (
        <div key={step.key} className="relative flex flex-col items-center text-center">
          {i < steps.length - 1 && (
            <div
              className={`hidden lg:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${
                step.completed ? "bg-[#006B4D]" : "bg-[#E8E8E8]"
              }`}
              aria-hidden
            />
          )}
          <StepIcon step={step} />
          <p className={`text-xs font-bold mt-2 ${step.active ? "text-[#006B4D]" : "text-[#1D1D1D]"}`}>
            {step.label}
          </p>
          <p className="text-[10px] text-[#1D1D1D60] mt-0.5 leading-snug px-1">{step.subtitle}</p>
          {step.timestamp && (
            <p className="text-[10px] text-[#006B4D] mt-1 font-medium">{step.timestamp}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderTracker;
