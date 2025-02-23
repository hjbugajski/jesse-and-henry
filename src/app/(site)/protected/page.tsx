import { Suspense } from 'react';

import { queryPage } from '@/actions/page';
import { metadata } from '@/app/(site)/layout';
import ProtectedForm from '@/components/forms/protected';
import type { PageProps } from '@/lib/types/page-props';
import { pageTitle } from '@/lib/utils/page';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await queryPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

const ProtectedFormLoading = () => (
  <div className="flex flex-col gap-4">
    <div className="space-y-2">
      <div className="h-3 w-36 animate-pulse rounded-sm bg-black/5" />
      <div className="h-11 w-full animate-pulse rounded-lg bg-black/5" />
    </div>
    <div className="h-11 w-full animate-pulse rounded-lg bg-black/10" />
  </div>
);

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12">
      <h1 className="mb-4 text-3xl tracking-wider">Protected</h1>
      <p className="mb-6 text-sm text-pretty">
        Enter the guest password found on the back of your save the date or included with your
        invitation to view this page.
      </p>
      <Suspense fallback={<ProtectedFormLoading />}>
        <ProtectedForm />
      </Suspense>
    </div>
  );
}
