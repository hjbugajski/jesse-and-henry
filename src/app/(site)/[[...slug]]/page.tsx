import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

import { fetchCachedPage } from '@/actions/page';
import { metadata } from '@/app/(site)/layout';
import { RichText } from '@/components/rich-text';
import type { PageProps } from '@/lib/types/page-props';
import { pageTitle } from '@/lib/utils/page';
import config from '@payload-config';

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      pagination: false,
      overrideAccess: false,
      select: {
        slug: true,
      },
    });

    return pages.docs.map(({ slug }) => ({ slug: [slug] }));
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCachedPage({ slug });

  if (!page) {
    notFound();
  }

  return <RichText data={page.content} />;
}
