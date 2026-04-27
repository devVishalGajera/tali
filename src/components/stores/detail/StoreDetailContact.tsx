import type { StoreDetail } from "./storeDetailTypes";

interface Props { contact: StoreDetail["contact"] }

const StoreDetailContact = ({ contact }: Props) => {
  const rows = [
    {
      icon: "/assets/icons/call.svg",
      label: "Phone :",
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    {
      icon: "/assets/icons/whatsapp.svg",
      label: "WhatsApp :",
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/\s/g, "")}`,
    },
    {
      icon: "/assets/icons/website.svg",
      label: "Website :",
      value: contact.website,
      href: `https://${contact.website}`,
      isLink: true,
    },
    {
      icon: "/assets/icons/route.svg",
      label: "Radius :",
      value: contact.radius,
    },
    {
      icon: "/assets/icons/delivery_truck_speed.svg",
      label: "Delivery :",
      value: contact.delivery,
    },
    {
      icon: "/assets/icons/est-time.svg",
      label: "Est. Time :",
      value: contact.estTime,
    },
    {
      icon: "/assets/icons/local_parking.svg",
      label: "Parking :",
      value: contact.parking,
    },
  ];

  return (
    <section className="py-6 border-t border-[#F0F0F0]">
      <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Contact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8">
        {rows.map((c) => (
          <div key={c.label} className="flex items-start gap-3">
            <img
              src={c.icon}
              alt={c.label}
              className="w-5 h-5 mt-0.5 shrink-0 object-contain"
            />
            <div>
              <p className="text-xs text-[#1D1D1DB2] mb-0.5">{c.label}</p>
              {c.isLink ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-[#0077FF] hover:underline"
                >
                  {c.value}
                </a>
              ) : (
                <p className="text-sm font-bold text-[#1D1D1D]">{c.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreDetailContact;
