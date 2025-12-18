import type { Metadata } from 'next';
import { Sidebar } from '../components/Sidebar';
import { Providers } from '../components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'GTTM Hub',
  description: 'Ritual Container & Engineering Environment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased font-sans min-h-screen flex">
        <Providers>
          {/* The Fixed Control Panel */}
          <Sidebar />

          {/* The Main Stage (Shifted right by w-64) */}
          <main className="flex-1 ml-64 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
