'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/icons';

interface Props {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorBoundary({ error, retry }: Props) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
      <div>
        <h1 className="mb-4 text-2xl">Something Went Wrong</h1>
        <p>An unexpected error occurred. Try again, or reload the page.</p>
        {error.digest ? (
          <p className="mt-2 text-sm text-neutral-variant-30">Reference: {error.digest}</p>
        ) : null}
      </div>
      <Button onClick={retry} iconPosition="right">
        Try Again
        <Icons name="arrowRight" />
      </Button>
    </section>
  );
}
