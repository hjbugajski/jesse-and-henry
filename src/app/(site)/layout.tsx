import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { Alice, Lato } from 'next/font/google';
import Script from 'next/script';
import { getPayload } from 'payload';
import type { GlobalSlug } from 'payload';

import Footer from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { env } from '@/env/client';
import Toaster from '@/lib/providers/toaster';
import { cn } from '@/lib/utils/cn';
import type { PayloadNavigationGlobal } from '@/payload/payload-types';
import payloadConfig from '@/payload/payload.config';

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

const fetchGlobal = async (slug: GlobalSlug) => {
  const payload = await getPayload({ config: payloadConfig });

  return payload.findGlobal({ slug });
};

const fetchCachedGlobal = <T,>(slug: GlobalSlug) =>
  unstable_cache(fetchGlobal, [slug], {
    tags: [`global_${slug}`],
  })(slug) as Promise<T>;

export default async function RootLayout({ children }: Props) {
  const navigation = await fetchCachedGlobal<PayloadNavigationGlobal>('navigation');

  return (
    <html
      lang="en"
      className={cn(
        alice.variable,
        lato.variable,
        'bg-neutral-99 text-neutral-25 md-lg:scroll-p-24 h-full scroll-p-12 scroll-smooth! font-sans font-normal tracking-wider',
      )}
    >
      <body className="flex h-full flex-col self-start">
        <Navigation {...navigation} />
        <main className="md-lg:mt-16 flex flex-1 flex-col">{children}</main>
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
