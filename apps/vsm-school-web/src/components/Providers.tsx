'use client';

import { NetProvider } from '@gttm/components';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <NetProvider>
        {children}
      </NetProvider>
    </ThemeProvider>
  );
}
