const StoreDetailLocation = ({ address }: { address: string }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-4">Location</h2>
    <p className="text-sm text-[#1D1D1D] mb-4">
      <span className="font-bold">Address :</span> {address}
    </p>
    <div className="w-full h-[280px] rounded-xl overflow-hidden border border-[#F0F0F0]">
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=72.8,19.0,72.95,19.1&layer=mapnik"
        className="w-full h-full"
        loading="lazy"
        title="Store Location"
      />
    </div>
  </section>
);

export default StoreDetailLocation;
