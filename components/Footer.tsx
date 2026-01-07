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
      
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <Image
              src="/logo.svg"
              alt="SENKAI Logo"
              width={382}
              height={89}
              className="w-48 md:w-56 h-auto object-contain mb-1"
            />
            <p className="text-[#FEF6FF] font-semibold text-sm md:text-base uppercase">
              2025 SENKAI © All Rights Reserved
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center md:justify-end gap-4 md:gap-6 w-full md:w-1/2">
            <Link
              href="https://x.com/senkai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/X.svg"
                alt="X (Twitter)"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
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
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </Link>
            <Link
              href="#"
              className="hover:opacity-80 transition-opacity"
            >
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/Discord.svg"
                alt="Discord"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

