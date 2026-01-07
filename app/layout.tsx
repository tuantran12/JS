import type { Metadata } from "next";
import { Konkhmer_Sleokchher } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const konkhmer = Konkhmer_Sleokchher({
  subsets: ["latin", "khmer"],
  weight: ["400"],
  display: "swap",
  variable: "--font-konkhmer",
});

export const metadata: Metadata = {
  title: "SENKAI - Crypto Analytics Platform",
  description: "Real-time cryptocurrency market data and analytics platform",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "market data", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={konkhmer.variable}>
      <body className="font-sans antialiased bg-[#000000] text-white">
        <TooltipProvider>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
