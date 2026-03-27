import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // El Admin ya hereda el html/body del layout raíz automáticamente
  return (
    <div className="min-h-screen bg-[#0B0F19]">
      {children}
    </div>
  );
}