import { Anton, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/shared/AnnouncementBar";
import Navbar from "@/components/shared/nav/Navbar";
import Footer from "@/components/shared/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import PromoModal from "@/components/shared/PromoModal";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton-face",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata = {
  title: "Anime Streetwear Australia — ZENJI",
  description: "Japanese-inspired anime streetwear born from warrior spirit. Modern oversized tees, hoodies, and Japanese craftsmanship engineered for those navigating an increasingly fragmented world.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothScrollProvider>
          <AnnouncementBar />
          <Navbar cartCount={2} wishlistCount={3} />
          <main>
            {children}
          </main>
          <Footer />
          <PromoModal />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
