import type { Metadata } from 'next';
import { Alice, Lato } from 'next/font/google';
import Script from 'next/script';

import { fetchCachedGlobal } from '@/actions/globals';
import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { env } from '@/env/client';
import { Toaster } from '@/lib/providers/toaster';
import { cn } from '@/lib/utils/cn';
import type { PayloadNavigationGlobal } from '@/payload/payload-types';

import './globals.css';

type Props = Readonly<{ children: React.ReactNode }>;

const alice = Alice({ weight: '400', subsets: ['latin'], variable: '--font-alice' });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'Jesse & Henry',
  description: 'Jesse and Henry are getting married!',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/icons/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default async function RootLayout({ children }: Props) {
  const navigation = await fetchCachedGlobal<PayloadNavigationGlobal>('navigation');

  return (
    <html
      lang="en"
      className={cn(
        alice.variable,
        lato.variable,
        'h-full scroll-p-12 scroll-smooth! bg-neutral-99 font-sans font-normal text-neutral-25 md-lg:scroll-p-24',
      )}
    >
      <body className="flex h-full flex-col self-start">
        <Navigation {...navigation} />
        <main className="flex flex-1 flex-col md-lg:mt-16">{children}</main>
        <Footer />
        <Toaster />
        <Script
          src={env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={env.NEXT_PUBLIC_DOMAIN}
        />
      </body>
    </html>
  );
}
