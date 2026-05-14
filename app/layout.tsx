import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export const metadata: Metadata = {
  title: 'SSC Preparation Dashboard',
  description: 'A clean dashboard shell for SSC preparation.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen">
          <Sidebar />
          <div className="ml-[240px] min-h-screen bg-slate-50 px-6 py-6 md:px-10">
            <TopBar />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
