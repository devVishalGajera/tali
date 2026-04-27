interface PaymentMethod {
  name: string;
  icon: string;
}

const StoreDetailPayments = ({ payments }: { payments: PaymentMethod[] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Payment Methods</h2>
    <div className="flex flex-wrap gap-3">
      {payments.map((p) => (
        <img
          key={p.name}
          src={p.icon}
          alt={p.name}
          className="h-10 w-auto object-contain"
        />
      ))}
    </div>
  </section>
);

export default StoreDetailPayments;
