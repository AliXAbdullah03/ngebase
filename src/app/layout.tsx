import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Next Global Express',
  description: 'Track your shipment with Next Global Express.',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={cn('font-sans antialiased')}>
        {children}
        <Toaster />
        <div className="fixed bottom-4 right-4 z-50">
          <Button asChild size="icon" className="w-16 h-16 rounded-full shadow-lg">
            <Link href="#">
              <MessageCircle className="h-8 w-8" />
              <span className="sr-only">Instant Support</span>
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
