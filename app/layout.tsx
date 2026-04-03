import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className="bg-[#0B0F19] text-white antialiased min-h-screen w-full overflow-x-hidden">
        <div className="relative w-full min-h-screen overflow-x-hidden">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}