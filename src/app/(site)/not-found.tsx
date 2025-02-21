import Link from 'next/link';

import { Button } from '@/lib/components/button';
import { Icons } from '@/lib/components/icons';

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
      <div>
        <h1 className="mb-4 text-2xl">Page Not Found</h1>
        <p>The page you&apos;re looking for does not exist or has been moved.</p>
      </div>
      <Button asChild iconPosition="right">
        <Link href="/">
          Home
          <Icons name="arrowRight" />
        </Link>
      </Button>
    </section>
  );
}
