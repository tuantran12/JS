import './globals.css';
import type { Metadata } from 'next';
import PrivyProvider from '../components/privy/PrivyProvider';
import AuthGuard from '../components/privy/AuthGuard';
import Header from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'Senkai - AI Copy Trading Platform',
  description: 'AI-powered copy trading on Solana with 24/7 auto-execution'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider>
          <AuthGuard>
            <Header />
            <main style={{ paddingTop: 60 }}>{children}</main>
          </AuthGuard>
        </PrivyProvider>
      </body>
    </html>
  );
}
