import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AgeVerificationProvider } from "@/components/modals/AgeVerificationProvider";
import { LocationProvider } from "@/components/modals/LocationProvider";
import { CartProvider } from "@/components/modals/CartProvider";
import CartModal from "@/components/modals/CartModal";
import CartDrawer from "@/components/modals/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://talli.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "Talli — Wine, Spirits & Beer Delivered Fast",
    template: "%s | Talli",
  },
  description:
    "Order wine, whisky, beer, vodka, rum, gin and more online. Fast delivery across India. Browse top brands and exclusive offers on Talli.",
  keywords: ["wine delivery", "liquor store online", "buy whisky online", "beer delivery India", "spirits online"],
  authors: [{ name: "Talli" }],
  creator: "Talli",
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         SITE_URL,
    siteName:    "Talli",
    title:       "Talli — Wine, Spirits & Beer Delivered Fast",
    description: "Order wine, whisky, beer, vodka, rum, gin and more online. Fast delivery across India.",
    images: [{ url: "/assets/logo/logo-64x64.svg", width: 64, height: 64, alt: "Talli logo" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Talli — Wine, Spirits & Beer Delivered Fast",
    description: "Order wine, whisky, beer, vodka, rum, gin and more online. Fast delivery across India.",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon:  "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AgeVerificationProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
              <CartModal />
              <CartDrawer />
            </CartProvider>
          </LocationProvider>
        </AgeVerificationProvider>
      </body>
    </html>
  );
}
