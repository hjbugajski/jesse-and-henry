import Link from 'next/link';

import { Icons } from '@/lib/components/icons';

export function Footer() {
  return (
    <footer className="bg-neutral-99 p-4 pb-20 md-lg:pb-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-6 rounded-3xl bg-neutral-variant-90/75 p-6 text-neutral-variant-30">
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            href="https://bugajski.io"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center text-sm no-underline"
          >
            Made with
            <Icons name="heart" size="sm" className="mx-0.5 text-danger-40" />
            in NYC
          </Link>
        </div>
      </div>
    </footer>
  );
}
