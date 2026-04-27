import type { StoreDetail } from "./storeDetailTypes";

const socialIcons = [
  { key: "facebook"  as const, label: "Facebook",  icon: "/assets/icons/social-icon/facebook.svg" },
  { key: "instagram" as const, label: "Instagram", icon: "/assets/icons/social-icon/instagram.svg" },
  { key: "twitter"   as const, label: "Twitter",   icon: "/assets/icons/social-icon/twitter.svg" },
  { key: "youtube"   as const, label: "YouTube",   icon: "/assets/icons/social-icon/youtube.svg" },
];

const StoreDetailSocialLinks = ({ social }: { social: StoreDetail["social"] }) => (
  <section className="py-6 border-t border-[#F0F0F0]">
    <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Social Links</h2>
    <div className="flex gap-3">
      {socialIcons.map((s) => (
        <a
          key={s.label}
          href={social[s.key]}
          aria-label={s.label}
          className="w-10 h-10 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:border-[#1D1D1D] transition-colors"
        >
          <img src={s.icon} alt={s.label} className="w-5 h-5 object-contain" />
        </a>
      ))}
    </div>
  </section>
);

export default StoreDetailSocialLinks;
