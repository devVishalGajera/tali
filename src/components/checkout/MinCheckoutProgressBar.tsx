import { MIN_CHECKOUT_ORDER } from "@/lib/api/cart";
import { fmtInr } from "@/lib/checkout/formatMoney";

const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#006B4D]" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Props {
  orderSubtotal: number;
  className?: string;
  reachedMessage?: string;
}

const MinCheckoutProgressBar = ({
  orderSubtotal,
  className = "",
  reachedMessage = "Minimum order value reached — you can proceed to checkout",
}: Props) => {
  const meetsMinimum = orderSubtotal >= MIN_CHECKOUT_ORDER;
  const amountAway = Math.max(0, MIN_CHECKOUT_ORDER - orderSubtotal);
  const progressPct = Math.min(100, (orderSubtotal / MIN_CHECKOUT_ORDER) * 100);

  return (
    <div className={`rounded-xl bg-[#E8F5EF] border border-[#CFEBDD] px-3 py-3 ${className}`}>
      <div className="flex items-start gap-2">
        <ShieldCheckIcon />
        <p className="text-xs font-semibold text-[#1D1D1D] leading-snug flex-1">
          {meetsMinimum
            ? reachedMessage
            : `You're ${fmtInr(amountAway)} away from checkout`}
        </p>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-white/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#006B4D] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#1D1D1D] shrink-0">
          {fmtInr(MIN_CHECKOUT_ORDER)}
        </span>
      </div>
    </div>
  );
};

export default MinCheckoutProgressBar;
