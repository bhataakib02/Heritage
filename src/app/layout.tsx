import type { Metadata } from 'next'
import './globals.css'
import 'remixicon/fonts/remixicon.css'
import UILibraryProvider from '@/providers/UILibraryProvider'
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProviders from '@/providers/LayoutProviders';


export const metadata: Metadata = {
  title: 'Heritage World - Explore Cultural Heritage',
  description: 'Discover and book museum events, exhibitions, and cultural heritage experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-200 h-screen">
          <UILibraryProvider>
            <LayoutProviders>{children}</LayoutProviders>
          </UILibraryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
