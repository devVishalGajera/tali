const StoreDetailLocation = ({ address }: { address: string }) => {
  const mapsQuery = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <section className="py-6 border-t border-[#F0F0F0]">
      <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1D] mb-4">Location</h2>
      <p className="text-sm text-[#1D1D1D] mb-4 leading-relaxed">
        <span className="font-bold">Address :</span> {address}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-xl overflow-hidden border border-[#F0F0F0] bg-[#F5F5F5] hover:border-[#006B4D]/40 transition-colors"
      >
        <div className="flex flex-col items-center justify-center gap-2 h-[180px] sm:h-[220px] px-4 text-center">
          <svg
            className="w-10 h-10 text-[#006B4D]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-sm font-semibold text-[#006B4D]">Open in Google Maps</span>
          <span className="text-xs text-[#1D1D1D80]">Tap to view directions</span>
        </div>
      </a>
    </section>
  );
};

export default StoreDetailLocation;
