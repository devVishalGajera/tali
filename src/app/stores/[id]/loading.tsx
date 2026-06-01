export default function StoreDetailLoading() {
  return (
    <main className="w-full bg-white min-h-[60vh] animate-pulse">
      <div className="h-[280px] sm:h-[380px] bg-[#E8E8E8]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#F5F5F5] rounded-2xl" />
          ))}
        </div>
        <div className="h-40 bg-[#F5F5F5] rounded-xl" />
        <div className="h-56 bg-[#F5F5F5] rounded-xl" />
      </div>
    </main>
  );
}
