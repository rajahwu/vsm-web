'use client';

import { NetProvider } from '@gttm/ritual-ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NetProvider>
      {children}
    </NetProvider>
  );
}
