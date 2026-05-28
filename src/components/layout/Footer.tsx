import Image from "next/image";
import Link from "next/link";
import type { NavCategory } from "@/lib/api/categories";

interface FooterLink {
  label: string;
  href: string;
}

interface Props {
  navCategories?: NavCategory[];
}

/**
 * Look up a top-level category by (case-insensitive) name and return its
 * /products filter URL. Falls back to a search query for unknown labels.
 */
function resolveCategory(label: string, cats: NavCategory[]): string {
  const match = cats.find(
    (c) => c.name.trim().toLowerCase() === label.trim().toLowerCase(),
  );
  if (match) return `/products?categories=${match.id}`;
  return `/products?q=${encodeURIComponent(label)}`;
}

/**
 * Look up a sub-category by name across all top-level categories.
 * Returns the combined /products filter URL when found, otherwise a
 * search query.
 */
function resolveSubCategory(label: string, cats: NavCategory[]): string {
  const needle = label.trim().toLowerCase();
  for (const cat of cats) {
    const sub = cat.subcategory?.find(
      (s) => s.name.trim().toLowerCase() === needle,
    );
    if (sub) return `/products?categories=${cat.id}&subcats=${sub.id}`;
  }
  return `/products?q=${encodeURIComponent(label)}`;
}

const Footer = ({ navCategories = [] }: Props) => {
  const menuLinks: FooterLink[] = [
    { label: "Deals", href: "/products" },
    { label: "Beer", href: resolveCategory("Beer", navCategories) },
    { label: "Wine", href: resolveCategory("Wine", navCategories) },
    { label: "Spirits", href: resolveCategory("Spirits", navCategories) },
    { label: "Extras", href: resolveCategory("Extras", navCategories) },
    { label: "Most Popular", href: "/popular-stores" },
    { label: "My Orders", href: "/orders" },
    { label: "Blog", href: "/" },
    { label: "Indian", href: "/products?q=indian" },
    { label: "Whiskey", href: "/products?q=whiskey" },
  ];

  const categoryLinks: FooterLink[] = [
    { label: "Red Wine", href: resolveSubCategory("Red Wine", navCategories) },
    { label: "White Wine", href: resolveSubCategory("White Wine", navCategories) },
    { label: "Rose Wine", href: resolveSubCategory("Rose Wine", navCategories) },
    { label: "Sparkling Wine", href: resolveSubCategory("Sparkling Wine", navCategories) },
    { label: "Mild Beers", href: resolveSubCategory("Mild Beers", navCategories) },
    { label: "Strong Beer", href: resolveSubCategory("Strong Beer", navCategories) },
    { label: "Imported Beer", href: resolveSubCategory("Imported Beer", navCategories) },
  ];

  const infoLinks: FooterLink[] = [
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "About Us", href: "/about" },
    { label: "Customer Support", href: "/support" },
    { label: "Locations", href: "/stores" },
  ];

  const legalLinks: FooterLink[] = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const myChoiceLinks: FooterLink[] = [
    { label: "Favorites", href: "/wishlist" },
    { label: "My Orders", href: "/orders" },
    { label: "Track Order", href: "/track-order" },
  ];

  const socialLinks = [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Twitter", href: "https://twitter.com" },
  ];

  const renderLinkList = (items: FooterLink[]) =>
    items.map((item) => (
      <li key={item.label}>
        <Link
          href={item.href}
          className="text-sm hover:underline hover:text-[#006B4D] transition-colors"
        >
          {item.label}
        </Link>
      </li>
    ));

  return (
    <footer className="w-full bg-[#FAF4F2] text-[#1D1D1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="grid grid-cols-5 gap-8 lg:gap-12 mb-8">
            {/* Need Help? Column */}
            <div className="col-span-1">
              <div className="mb-6">
                <Image
                  src="/assets/logo/talli-logo.jpeg"
                  alt="Talli Logo"
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                />
              </div>
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <p className="text-sm mb-4 leading-relaxed">
                Visit our{" "}
                <Link href="/support" className="underline hover:text-[#006B4D] transition-colors">
                  Customer Support
                </Link>{" "}
                for assistance or call us at
              </p>
              <a
                href="tel:+917779027171"
                className="block text-base font-semibold mb-4 hover:text-[#006B4D] transition-colors"
              >
                +91 7779027171
              </a>
              <p className="text-sm mb-6 leading-relaxed">
                Address: Shop no.1, amanda shopping center, HIRANANDANI
                MEADOWS, Manpada, Thane West, Thane, Maharashtra 400610
              </p>
              <div className="flex gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-gray-600 hover:text-[#1D1D1D] transition-colors"
                  >
                    {s.label === "Facebook" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {s.label === "Instagram" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {s.label === "Twitter" && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Menu Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Menu</h3>
              <ul className="space-y-2">{renderLinkList(menuLinks)}</ul>
            </div>

            {/* Categories Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">{renderLinkList(categoryLinks)}</ul>
            </div>

            {/* Info Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">Info</h3>
              <ul className="space-y-2">{renderLinkList(infoLinks)}</ul>
            </div>

            {/* My Choice Column */}
            <div>
              <h3 className="text-lg font-bold mb-4">My Choice</h3>
              <ul className="space-y-2">{renderLinkList(myChoiceLinks)}</ul>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {/* Logo and Contact Section */}
          <div className="mb-8">
            <div className="mb-6">
              <Image
                src="/assets/logo/talli-logo.jpeg"
                alt="Talli Logo"
                width={80}
                height={80}
                className="w-16 h-16 rounded-full"
              />
            </div>
            <h3 className="text-lg font-bold mb-4">Need Help?</h3>
            <p className="text-sm mb-4 leading-relaxed">
              Visit our{" "}
              <Link href="/support" className="underline hover:text-[#006B4D] transition-colors">
                Customer Support
              </Link>{" "}
              for assistance or call us at
            </p>
            <a
              href="tel:+917779027171"
              className="block text-base font-semibold mb-4 hover:text-[#006B4D] transition-colors"
            >
              +91 7779027171
            </a>
            <p className="text-sm mb-6 leading-relaxed">
              Address: Shop no.1, amanda shopping center, HIRANANDANI MEADOWS,
              Manpada, Thane West, Thane, Maharashtra 400610
            </p>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-600 hover:text-[#1D1D1D] transition-colors"
                >
                  {s.label === "Facebook" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                  {s.label === "Instagram" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  {s.label === "Twitter" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-base font-bold mb-3">Menu</h3>
              <ul className="space-y-2">{renderLinkList(menuLinks)}</ul>
            </div>

            <div>
              <h3 className="text-base font-bold mb-3">Categories</h3>
              <ul className="space-y-2">{renderLinkList(categoryLinks)}</ul>
            </div>

            <div>
              <h3 className="text-base font-bold mb-3">My Choice</h3>
              <ul className="space-y-2">{renderLinkList(myChoiceLinks)}</ul>
            </div>
          </div>

          {/* Info Links */}
          <div className="border-t border-gray-300 pt-6">
            <div className="flex flex-wrap gap-4">
              {infoLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm hover:underline hover:text-[#006B4D] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mt-8 md:mt-12 text-center">
          <Link
            href="/"
            className="inline-block text-2xl md:text-3xl font-bold text-[#1D1D1D] hover:text-[#006B4D] transition-colors"
          >
            Talli
          </Link>
        </div>

        {/* Legal strip */}
        <div className="mt-6 md:mt-8 pt-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs sm:text-sm text-[#1D1D1D]/70">
            <p>© {new Date().getFullYear()} Talli Drinks. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="hover:text-[#006B4D] hover:underline transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
