import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Crypto Analytics Platform",
  description: "Real-time cryptocurrency market data and analytics platform",
  keywords: ["cryptocurrency", "bitcoin", "ethereum", "market data", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <TooltipProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with Next.js, TypeScript, and TradingView Charts. Data from Binance, CoinGecko, and more.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  © 2024 Crypto Analytics. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
