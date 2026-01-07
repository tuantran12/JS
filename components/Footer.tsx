"use client";

import Image from "next/image";
import Link from "next/link";

// Disable Next.js Image optimization for external images temporarily
const ExternalImage = ({ src, alt, width, height, className }: any) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
};

export function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-[#121212] relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[#FFFF02] noise-overlay"></div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-16 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/LOGO.svg"
              alt="SENKAI Logo"
              width={150}
              height={60}
              className="mb-2"
            />
            <p className="text-[#FEF6FF] font-semibold text-base uppercase">
              2025 SENKAI © All Rights Reserved
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center md:justify-end gap-6 w-full md:w-1/2">
            <Link
              href="https://x.com/senkai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/X.svg"
                alt="X (Twitter)"
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14"
              />
            </Link>
            <Link
              href="https://t.me/senkai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/Tele.svg"
                alt="Telegram"
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14"
              />
            </Link>
            <Link
              href="#"
              className="hover:opacity-80 transition-opacity"
            >
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/Discord.svg"
                alt="Discord"
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

