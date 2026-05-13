import type { ReactNode } from 'react';

// Root layout — locale layout renders <html>/<body>, so this is a passthrough.
// Required by Next.js (every app/ tree needs a root layout.tsx).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
