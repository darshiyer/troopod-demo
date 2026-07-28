import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GrowthPilot AI — Enterprise E-Commerce CRO & Sales Engine',
  description: 'AI Growth Audit & Sales Automation Platform for fast-moving e-commerce agencies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
