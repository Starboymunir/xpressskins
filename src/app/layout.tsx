import type { Metadata } from "next";
import { Inter, Syne, Instrument_Serif, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["600", "700", "800"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["italic", "normal"] });
const jp = Noto_Sans_JP({ variable: "--font-jp", subsets: ["latin"], weight: ["700", "900"], preload: false });

export const metadata: Metadata = {
  title: "Xpress Skins | Custom Itasha Anime Car Wraps, Houston TX",
  description:
    "Original anime artwork drawn for your car, printed on cast vinyl and installed in Houston or shipped nationwide. Price your itasha wrap in sixty seconds.",
  keywords: ["itasha", "anime car wrap", "custom vehicle wrap", "anime wrap", "car wrap houston"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${syne.variable} ${serif.variable} ${jp.variable} font-sans antialiased bg-background text-foreground noise`}>
        <SmoothScroll />
        <Cursor />
        <PublicNavbar />
        <main>{children}</main>
        <PublicFooter />
      </body>
    </html>
  );
}
