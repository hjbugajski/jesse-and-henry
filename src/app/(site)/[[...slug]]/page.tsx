import { Suspense } from 'react';

import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import config from '@payload-config';

import { fetchCachedPage, fetchCachedPageMeta } from '@/actions/page';
import { metadata } from '@/app/(site)/layout';
import { RichText } from '@/components/rich-text';
import type { PageProps } from '@/types/page-props';
import { pageTitle } from '@/utils/page';

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      pagination: false,
      overrideAccess: false,
      select: {
        path: true,
      },
    });

    const params = pages.docs.map(({ path }) => ({
      slug: path?.split('/')?.slice(1) || undefined,
    }));

    // Cache Components requires at least one param so the route can be prerendered and validated.
    return params.length ? params : [{ slug: undefined }];
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPageMeta({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

const PageContentLoading = () => (
  <section className="mx-auto w-full max-w-7xl">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-12">
      <div className="bg-black/5 mb-2 h-9 w-1/2 animate-pulse rounded-lg" />
      <div className="bg-black/5 h-4 w-full animate-pulse rounded-sm" />
      <div className="bg-black/5 h-4 w-full animate-pulse rounded-sm" />
      <div className="bg-black/5 h-4 w-3/4 animate-pulse rounded-sm" />
    </div>
  </section>
);

/**
 * The page document is read with the visitor's Payload session and draft mode, so it cannot be part
 * of the static shell. Only the content streams; the layout chrome prerenders.
 */
async function PageContent({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  if (!page) {
    notFound();
  }

  return <RichText data={page.content} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<PageContentLoading />}>
      <PageContent params={params} />
    </Suspense>
  );
}
