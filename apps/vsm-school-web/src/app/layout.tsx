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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 antialiased font-sans min-h-screen">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            {/* The Main Stage pattern handles its own layout/margin via CSS or dynamic classes if needed, 
                but for simplicity with fixed sidebar, we'll keep it flexible. */}
            <main className="flex-1 transition-all duration-300">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
