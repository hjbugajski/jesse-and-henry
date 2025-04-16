import { Suspense } from 'react';

import { fetchCachedPage } from '@/actions/page';
import { metadata } from '@/app/(site)/layout';
import { ProtectedForm } from '@/components/forms/protected';
import type { PageProps } from '@/types/page-props';
import { pageTitle } from '@/utils/page';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

const ProtectedFormLoading = () => (
  <div className="flex flex-col gap-4">
    <div className="space-y-2">
      <div className="bg-black/5 h-3 w-36 animate-pulse rounded-sm" />
      <div className="bg-black/5 h-11 w-full animate-pulse rounded-lg" />
    </div>
    <div className="bg-black/10 h-11 w-full animate-pulse rounded-lg" />
  </div>
);

export default function Page() {
  return (
    <>
      <h1 className="mb-4 text-3xl">Protected</h1>
      <p className="mb-6 text-sm text-pretty">
        Enter the guest password found on the back of your save the date or included with your
        invitation to view this page.
      </p>
      <Suspense fallback={<ProtectedFormLoading />}>
        <ProtectedForm />
      </Suspense>
    </>
  );
}
