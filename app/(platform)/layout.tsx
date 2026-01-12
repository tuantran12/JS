// Platform layout - authentication required pages
// Privy provider is in root layout, no need for additional providers here

export const dynamic = 'force-dynamic';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
