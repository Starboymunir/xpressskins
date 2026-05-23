import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Xpress Skins Inc. | Custom Itasha Anime Car Wraps",
  description:
    "Transform your ride into a rolling masterpiece. Custom anime car wraps (Itasha) designed, printed, and installed by Xpress Skins Inc. in Houston, TX.",
  keywords: [
    "itasha",
    "anime car wrap",
    "custom vehicle wrap",
    "anime wrap",
    "car wrap houston",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground noise`}
      >
        <PublicNavbar />
        <main>{children}</main>
        <PublicFooter />
      </body>
    </html>
  );
}
