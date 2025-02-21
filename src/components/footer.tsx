import Link from 'next/link';

import { Icons } from '@/lib/components/icons';

export default function Footer() {
  return (
    <footer className="bg-neutral-99 md-lg:pb-4 p-4 pb-20">
      <div className="bg-neutral-variant-90/75 text-neutral-variant-30 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-6 rounded-3xl p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <Link
            href="https://bugajski.io"
            target="_blank"
            rel="noreferrer"
            className="flex flex-row items-center text-sm no-underline"
          >
            Made with
            <Icons name="heart" size="sm" className="text-danger-40 mx-0.5" />
            in NYC
          </Link>
        </div>
      </div>
    </footer>
  );
}
