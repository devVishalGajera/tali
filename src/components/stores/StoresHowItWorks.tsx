const steps = [
  {
    title: "Enter your address",
    desc: "Once you tell your location, we'll show you what's available in your local stores",
    icon: "/assets/icons/location.svg",
  },
  {
    title: "Shop items you like",
    desc: "Select your favorite items, compare price and shop from multiple stores at once",
    icon: "/assets/icons/shop-items.svg",
  },
  {
    title: "Get your items delivered",
    desc: "Store will deliver your order, or you can select to pickup from the store at your convenience",
    icon: "/assets/icons/delievered.svg",
  },
];

const StoresHowItWorks = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
    <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1D] mb-8">How It Works</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full border border-[#E0E0E0] flex items-center justify-center">
            <img src={step.icon} alt={step.title} className="w-7 h-7 object-contain" />
          </div>
          <h3 className="text-sm font-semibold text-[#1D1D1D]">{step.title}</h3>
          <p className="text-xs text-[#1D1D1D80] leading-relaxed max-w-[200px]">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StoresHowItWorks;
